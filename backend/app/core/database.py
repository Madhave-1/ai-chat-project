from motor.motor_asyncio import AsyncIOMotorClient
from app.core import config
import certifi
client = None
db = None
async def connect_db():
    global client, db  
    print("Connecting to MongoDB Atlas...")
    client = AsyncIOMotorClient(
        config.MONGODB_URL, 
        tlsCAFile=certifi.where()
    )
    db = client[config.DATABASE_NAME]
    print("Connected Successfully!")
async def close_db():
    print("Closing connection...")
    if client:
        client.close()
