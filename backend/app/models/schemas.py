from pydantic import BaseModel
class AuthRequest(BaseModel):
    email: str
    password: str
class ChatPrompt(BaseModel):
    chat_id: str
    message: str
