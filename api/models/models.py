from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base
import enum


class UserRole(str, enum.Enum):
    client = "client"
    admin = "admin"


class RequestStatus(str, enum.Enum):
    pending = "pending"
    in_review = "in_review"
    in_progress = "in_progress"
    completed = "completed"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.client)
    company = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    requests = relationship("InfraRequest", back_populates="owner")


class InfraRequest(Base):
    __tablename__ = "infra_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    service_type = Column(String, nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.pending)
    priority = Column(String, default="medium")
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    admin_notes = Column(Text, nullable=True)

    owner = relationship("User", back_populates="requests")