from fastapi import APIRouter, HTTPException
from app.models.schemas import AuthRequest
from app.core.security import hash_password, verify_password, create_jwt_token
from app.core import database
router = APIRouter(prefix="/auth", tags=["Authentication"])
@router.post("/signup")
async def signup(user_data: AuthRequest):
    existing_user = await database.db["users"].find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    secure_password = hash_password(user_data.password)
    new_user = {
        "email": user_data.email,
        "password": secure_password
    }
    await database.db["users"].insert_one(new_user)
    return {"message": "Account created successfully!"}
@router.post("/login")
async def login(user_data: AuthRequest):
    user = await database.db["users"].find_one({"email": user_data.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    is_correct = verify_password(user_data.password, user["password"])
    if not is_correct:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    token = create_jwt_token(user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "message": "Login successful!"
    }
