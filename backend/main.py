from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
import motor.motor_asyncio
import bcrypt
import jwt
from bson import ObjectId
import os
from contextlib import asynccontextmanager
from pymongo.errors import DuplicateKeyError

# ======================
# Config
# ======================
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "notes_app"

# MongoDB setup
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]
users_collection = db.users
notes_collection = db.notes

# ======================
# Pydantic Models
# ======================
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class NoteCreate(BaseModel):
    title: str
    content: str

class NoteUpdate(BaseModel):
    title: str
    content: str
    updated_at: Optional[datetime] = None  # optional optimistic locking

class NoteResponse(BaseModel):
    id: str
    title: str
    content: str
    user_id: str
    created_at: datetime
    updated_at: datetime

# ======================
# Auth
# ======================
security = HTTPBearer()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid authentication")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ======================
# Lifespan (startup)
# ======================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure indexes exist
    await users_collection.create_index("email", unique=True, background=True)
    await users_collection.create_index("username", unique=True, background=True)
    await notes_collection.create_index("user_id", background=True)
    yield

# FastAPI app
app = FastAPI(title="Notes API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React & Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# Auth Routes
# ======================
@app.post("/auth/signup", response_model=UserResponse)
async def signup(user_data: UserSignup):
    try:
        hashed_password = hash_password(user_data.password)
        user_doc = {
            "username": user_data.username,
            "email": user_data.email,
            "password_hash": hashed_password,
            "created_at": datetime.utcnow()
        }
        result = await users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
    except DuplicateKeyError as e:
        if "email" in str(e):
            raise HTTPException(status_code=400, detail="Email already registered")
        if "username" in str(e):
            raise HTTPException(status_code=400, detail="Username already taken")
        raise HTTPException(status_code=400, detail="User already exists")

    return UserResponse(
        id=str(user_doc["_id"]),
        username=user_doc["username"],
        email=user_doc["email"]
    )

@app.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    user = await users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user["_id"])})
    return TokenResponse(access_token=access_token, token_type="bearer")

# ======================
# Notes Routes
# ======================
@app.get("/notes", response_model=List[NoteResponse])
async def get_notes(current_user: dict = Depends(get_current_user)):
    notes = await notes_collection.find({"user_id": str(current_user["_id"])}).to_list(None)
    return [
        NoteResponse(
            id=str(note["_id"]),
            title=note["title"],
            content=note["content"],
            user_id=note["user_id"],
            created_at=note["created_at"],
            updated_at=note["updated_at"]
        )
        for note in notes
    ]

@app.post("/notes", response_model=NoteResponse)
async def create_note(note_data: NoteCreate, current_user: dict = Depends(get_current_user)):
    now = datetime.utcnow()
    note_doc = {
        "title": note_data.title,
        "content": note_data.content,
        "user_id": str(current_user["_id"]),
        "created_at": now,
        "updated_at": now
    }
    result = await notes_collection.insert_one(note_doc)
    note_doc["_id"] = result.inserted_id
    return NoteResponse(
        id=str(note_doc["_id"]),
        title=note_doc["title"],
        content=note_doc["content"],
        user_id=note_doc["user_id"],
        created_at=note_doc["created_at"],
        updated_at=note_doc["updated_at"]
    )

@app.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(note_id: str, current_user: dict = Depends(get_current_user)):
    try:
        note = await notes_collection.find_one({
            "_id": ObjectId(note_id),
            "user_id": str(current_user["_id"])
        })
    except:
        raise HTTPException(status_code=400, detail="Invalid note ID")

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    return NoteResponse(
        id=str(note["_id"]),
        title=note["title"],
        content=note["content"],
        user_id=note["user_id"],
        created_at=note["created_at"],
        updated_at=note["updated_at"]
    )

@app.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_data: NoteUpdate,
    current_user: dict = Depends(get_current_user)
):
    try:
        existing_note = await notes_collection.find_one({
            "_id": ObjectId(note_id),
            "user_id": str(current_user["_id"])
        })
    except:
        raise HTTPException(status_code=400, detail="Invalid note ID")

    if not existing_note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note_data.updated_at and existing_note["updated_at"] != note_data.updated_at:
        raise HTTPException(
            status_code=409,
            detail="Note was modified by another request. Please refresh."
        )

    now = datetime.utcnow()
    await notes_collection.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"title": note_data.title, "content": note_data.content, "updated_at": now}}
    )
    updated_note = await notes_collection.find_one({"_id": ObjectId(note_id)})
    return NoteResponse(
        id=str(updated_note["_id"]),
        title=updated_note["title"],
        content=updated_note["content"],
        user_id=updated_note["user_id"],
        created_at=updated_note["created_at"],
        updated_at=updated_note["updated_at"]
    )

@app.delete("/notes/{note_id}")
async def delete_note(note_id: str, current_user: dict = Depends(get_current_user)):
    try:
        result = await notes_collection.delete_one({
            "_id": ObjectId(note_id),
            "user_id": str(current_user["_id"])
        })
    except:
        raise HTTPException(status_code=400, detail="Invalid note ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")

    return {"message": "Note deleted successfully"}

# ======================
# Health Check
# ======================
@app.get("/")
async def root():
    return {"message": "Notes API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
