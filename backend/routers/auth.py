from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, models
from pydantic import BaseModel
import secrets # For simple token generation or use JWT
import uuid

# Simple Token implementation for MVP
# In real prod: Use PyJWT and hashed passwords (bcrypt)

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

class LoginRequest(BaseModel):
    username: str # This is owner_slug for owners
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    owner_id: str = None

# Mocked password hashing for MVP structure (replace with passlib)
def verify_password(plain, hashed):
    return plain == hashed # DANGEROUS: Change to bcrypt for real prod

@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest, db: Session = Depends(database.get_db)):
    # 1. Check if it's a User (superadmin or specific owner user)
    # The TS says: Users table has login/password.
    user = db.query(models.User).filter(models.User.login == creds.username).first()
    
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate simple session token (In prod: JWT)
    # For MVP we might just return the user ID as token if we don't have JWT setup, 
    # but let's fake a token.
    token = f"fake-jwt-token-{user.id}" 
    
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        role=user.role,
        owner_id=str(user.owner_id) if user.owner_id else None
    )

@router.get("/me")
def read_users_me(token: str):
    # Retrieve user by token logic
    return {"token": token, "msg": "User info"}
