import bcrypt
import jwt
from datetime import datetime, timedelta
from app.core import config
from fastapi import Request, HTTPException
def hash_password(plain_password: str) -> str:
    password_bytes = plain_password.encode('utf-8')
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed.decode('utf-8')
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )
def create_jwt_token(email: str) -> str:
    data = {
        "user_email": email,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    return jwt.encode(data, config.SECRET_KEY, algorithm="HS256")
def get_current_user_email(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid ID badge")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
        return payload.get("user_email")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired. Log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Fake token detected.")
