from fastapi import APIRouter, Request
from datetime import datetime
import httpx
from app.models.schemas import ChatPrompt
from app.core.security import get_current_user_email
from app.core import database
from app.core import config
router = APIRouter(prefix="/chat", tags=["Chat Window"])
async def ask_gemini(user_text: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={config.GEMINI_API_KEY}"
    payload = {
        "contents": [{
            "parts": [{"text": user_text}]
        }]
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=30.0)
            response.raise_for_status() 
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "I'm sorry, I am having trouble connecting to my brain right now."
@router.post("/")
async def chat_with_ai(request: Request, data: ChatPrompt):
    user_email = get_current_user_email(request)
    ai_reply = await ask_gemini(data.message)
    message_entry = {
        "user_message": data.message,
        "ai_response": ai_reply,
        "timestamp": datetime.utcnow()
    }
    await database.db["chats"].update_one(
        {"chat_id": data.chat_id, "user_email": user_email},
        {
            "$setOnInsert": {
                "title": data.message[:50] 
            },
            "$push": {
                "messages": message_entry
            },
            "$set": {
                "updated_at": datetime.utcnow()
            }
        },
        upsert=True
    )
    return {"reply": ai_reply}
@router.get("/history")
async def get_chat_history(request: Request):
    user_email = get_current_user_email(request)
    cursor = database.db["chats"].find({"user_email": user_email}).sort("updated_at", -1)
    history_list = []
    async for document in cursor:
        history_list.append({
            "chat_id": document.get("chat_id"),
            "title": document.get("title", "Chat"),
            "updated_at": document.get("updated_at")
        })
    return {"history": history_list}
@router.get("/{chat_id}")
async def get_chat_session(request: Request, chat_id: str):
    from fastapi import HTTPException
    user_email = get_current_user_email(request)
    chat_doc = await database.db["chats"].find_one({"chat_id": chat_id, "user_email": user_email})
    if not chat_doc:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return {"messages": chat_doc.get("messages", [])}
