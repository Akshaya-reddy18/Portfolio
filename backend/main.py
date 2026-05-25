import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from services.rag import generate_chat_response_stream
from services.vector_store import ingest_portfolio_data
from core.config import settings

BACKEND_DIR = Path(__file__).resolve().parent
PORTFOLIO_DATA_PATH = BACKEND_DIR / "data" / "portfolio_data.json"

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.GROQ_API_KEY:
        raise ValueError("CRITICAL ERROR: GROQ_API_KEY is missing. Please set it in your environment or .env file.")


    if not os.path.exists(settings.CHROMA_DB_DIR):
        print("ChromaDB directory not found. Running initial ingestion...")
        ingest_portfolio_data(str(PORTFOLIO_DATA_PATH))
    else:
        print("Loaded vector DB")
    yield

app = FastAPI(title="Akshaya AI Digital Twin API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-domain.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    mode: str = "engineer"

@app.post("/chat")
async def chat_stream(request: ChatRequest):
    if not request.message or not request.message.strip():
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
        
    valid_modes = ["engineer", "recruiter", "beginner"]
    if request.mode not in valid_modes:
        request.mode = "engineer"

    return StreamingResponse(
        generate_chat_response_stream(request.message, request.mode),
        media_type="text/event-stream"
    )

@app.post("/api/admin/ingest")
async def ingest_data():
    try:
        # User is instructed to place data in data/portfolio_data.json
        ingest_portfolio_data(str(PORTFOLIO_DATA_PATH))
        return {"status": "success", "message": "Data ingested successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
