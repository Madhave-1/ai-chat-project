import os
from dotenv import load_dotenv
load_dotenv()
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
