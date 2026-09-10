from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.database import connect_db, close_db
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()  
    yield               
    await close_db()    
app = FastAPI(title="AI Chat API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(chat_router)
@app.get("/")
def home():
    return {"message": "The clean enterprise server is running!"}
