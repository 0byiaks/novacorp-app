from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine
from db import init_db
from models import models
from routers import auth, requests

# Create tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NovaCorp API",
    description="Client portal API for NovaCorp cloud consulting",
    version="1.0.0"
)

# CORS — allow frontend to talk to API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://titotest.co.uk"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(requests.router)


@app.get("/health")
def health():
    return {"status": "healthy", "service": "novacorp-api", "version": "1.0.0"}


@app.get("/")
def root():
    return {"message": "NovaCorp API", "docs": "/docs"}