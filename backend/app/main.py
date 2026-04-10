from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, health
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(
    title="SupaChat Backend",
    description="Natural language analytics on blog data",
    version="1.0.0"
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, tags=["Health"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

# Prometheus metrics
Instrumentator().instrument(app).expose(app)

@app.get("/")
def root():
    return {"message": "SupaChat API is running 🚀"}