import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    CHROMA_DB_DIR: str = "./chroma_db"
    MODEL_NAME: str = "mixtral-8x7b-32768"
    
    class Config:
        env_file = ".env"

settings = Settings()

if settings.OPENAI_API_KEY:
    masked_key = f"{settings.OPENAI_API_KEY[:5]}...{settings.OPENAI_API_KEY[-4:]}" if len(settings.OPENAI_API_KEY) > 10 else "***"
    print(f"DEBUG: Loaded OPENAI_API_KEY: {masked_key}")
else:
    print("WARNING: OPENAI_API_KEY is not set.")

if settings.GROQ_API_KEY:
    masked_groq_key = f"{settings.GROQ_API_KEY[:5]}...{settings.GROQ_API_KEY[-4:]}" if len(settings.GROQ_API_KEY) > 10 else "***"
    print(f"DEBUG: Loaded GROQ_API_KEY: {masked_groq_key}")
else:
    print("WARNING: GROQ_API_KEY is not set.")
