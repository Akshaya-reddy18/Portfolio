# Akshaya — AI Digital Twin

This repository contains a Next.js frontend and a FastAPI backend that together implement Akshaya's AI-powered digital twin. The backend provides a retrieval-augmented generation (RAG) API backed by a vector store (Chroma) and a Groq LLM client.

## Quickstart (local)

Backend (in its folder):

```bash
cd backend
python -m venv .venv        # optional: create venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend (repo root):

```bash
cd src
# install Node deps (npm/yarn/pnpm)
npm install
npm run dev
```

Open http://localhost:3000 to view the frontend and the chat UI which talks to the backend.

## Environment variables

- `GROQ_API_KEY` — Groq API key (backend)
- `MODEL_NAME` — model id used by Groq client
- `CHROMA_DB_DIR` — directory where Chroma persists data (defaults to `./chroma_db`)
- `PORT` — backend port (defaults to `8000`)
- `NEXT_PUBLIC_BACKEND_URL` — frontend base URL for the API

Place backend variables in `backend/.env`. For production on Render, set the same variables in the Render service settings.

## Docker / Production

This project includes a `Dockerfile` for the backend to provide reproducible builds with native dependencies (SciPy / torch). Deploying to Render with Docker is recommended for reliability.

## Deploying to Render (summary)

1. Push the `main` branch to GitHub.
2. Create a Render Web Service and connect the repo; choose Docker or Python service.
3. Add required environment variables in the Render dashboard.
4. (Optional) Attach a Persistent Disk for `CHROMA_DB_DIR` if you want durable vector storage.

## Notes

- If you need a consistent female TTS voice across platforms, consider using a cloud TTS provider (Polly/Google/ElevenLabs) and stream audio to the client.
- Keep `backend/venv`, `.next`, and `node_modules` out of Git — they are already ignored in `.gitignore`.

---

If you'd like, I can add a short `Contributing` section, CI config, or a `render.yaml` for Render infra-as-code.
