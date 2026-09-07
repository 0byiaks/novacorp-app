from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models.models import UserRole, RequestStatus


# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    company: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    company: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


# InfraRequest schemas
class InfraRequestCreate(BaseModel):
    title: str
    description: str
    service_type: str
    priority: Optional[str] = "medium"


class InfraRequestUpdate(BaseModel):
    status: Optional[RequestStatus] = None
    admin_notes: Optional[str] = None
    priority: Optional[str] = None


class InfraRequestResponse(BaseModel):
    id: int
    title: str
    description: str
    service_type: str
    status: RequestStatus
    priority: str
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    admin_notes: Optional[str]
    owner: UserResponse

    class Config:
        from_attributes = True