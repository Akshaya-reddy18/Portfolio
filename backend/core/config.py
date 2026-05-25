from dotenv import load_dotenv
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")

class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    CHROMA_DB_DIR: str = "./chroma_db"
    MODEL_NAME: str = "mixtral-8x7b-32768"
    PORT: int = 8000
    NEXT_PUBLIC_BACKEND_URL: str = "http://127.0.0.1:8000"

    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

settings = Settings()

if settings.GROQ_API_KEY:
    masked_groq_key = f"{settings.GROQ_API_KEY[:5]}...{settings.GROQ_API_KEY[-4:]}" if len(settings.GROQ_API_KEY) > 10 else "***"
    print(f"DEBUG: Loaded GROQ_API_KEY: {masked_groq_key}")
else:
    print("WARNING: GROQ_API_KEY is not set.")
