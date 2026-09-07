from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from db.database import get_db
from models.models import InfraRequest, User, UserRole
from schemas.schemas import InfraRequestCreate, InfraRequestUpdate, InfraRequestResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/requests", tags=["requests"])


def get_user_from_token(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    return get_current_user(token, db)


@router.post("/", response_model=InfraRequestResponse)
def create_request(
    request_data: InfraRequestCreate,
    current_user: User = Depends(get_user_from_token),
    db: Session = Depends(get_db)
):
    request = InfraRequest(
        title=request_data.title,
        description=request_data.description,
        service_type=request_data.service_type,
        priority=request_data.priority,
        owner_id=current_user.id
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


@router.get("/", response_model=List[InfraRequestResponse])
def get_requests(
    current_user: User = Depends(get_user_from_token),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.admin:
        return db.query(InfraRequest).all()
    return db.query(InfraRequest).filter(
        InfraRequest.owner_id == current_user.id
    ).all()


@router.get("/{request_id}", response_model=InfraRequestResponse)
def get_request(
    request_id: int,
    current_user: User = Depends(get_user_from_token),
    db: Session = Depends(get_db)
):
    request = db.query(InfraRequest).filter(InfraRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if current_user.role != UserRole.admin and request.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")
    return request


@router.patch("/{request_id}", response_model=InfraRequestResponse)
def update_request(
    request_id: int,
    update_data: InfraRequestUpdate,
    current_user: User = Depends(get_user_from_token),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    request = db.query(InfraRequest).filter(InfraRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if update_data.status:
        request.status = update_data.status
    if update_data.admin_notes:
        request.admin_notes = update_data.admin_notes
    if update_data.priority:
        request.priority = update_data.priority

    db.commit()
    db.refresh(request)
    return request