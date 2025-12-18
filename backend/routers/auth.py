import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .. import database, models
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt

# --- Security Config ---
# In production, move these to environment variables!
SECRET_KEY = "CHANGE_ME_IN_PROD_TO_A_LONG_RANDOM_STRING"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200 # 30 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    owner_id: str = None

# --- Helper Functions ---

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Routes ---

@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.login == creds.username).first()
    
    if not user:
        # Avoid user enumeration by returning generic error, but for debug we can be specific
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.login, "role": user.role, "owner_id": str(user.owner_id) if user.owner_id else None},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        owner_id=str(user.owner_id) if user.owner_id else None
    )

@router.get("/me")
def read_users_me(token: str = Depends(oauth2_scheme)):
    # Simple validation demo
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    return {"username": username, "msg": "You are authorized"}
