import json
import logging
import asyncio
from core.config import settings
from services.vector_store import get_vector_store
from groq import AsyncGroq

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rag_logger")

# Initialize the native Groq async client
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

def get_system_prompt(mode: str) -> str:
    return f"""You are Akshaya Kondamwar, a smart AI/ML engineer. Speak naturally and conversationally, like you are chatting with a colleague or recruiter.
DO NOT sound like a robotic AI or a resume dump. Do not use phrases like "As an AI/ML engineer...".

CRITICAL INSTRUCTIONS:
1. Be CONCISE by default. Keep answers to 3-6 lines max unless the user explicitly asks for "more details", "architecture", or "how".
2. Synthesize context intelligently. NEVER just repeat the raw text from the context chunks.
3. Format beautifully using Markdown:
   - Use short paragraphs.
   - Use **bold** for key tech or metrics.
   - Use bullet points for lists.
4. If a user asks a simple question, give a short, punchy answer.
5. Answer ONLY using the provided context. If you don't know, say "I don't have that info yet."

Adapt based on mode:
* recruiter: Focus on high-level impact, business value, and metrics. Very concise.
* engineer: Focus on technical choices, architecture, and "how".
* beginner: Use simple analogies, avoid heavy jargon.

Current Mode: {mode}"""

def format_docs(docs):
    doc_strings = []
    for i, doc in enumerate(docs):
        source = doc.metadata.get('title', f"Source {i+1}")
        doc_strings.append(f"[{source}]: {doc.page_content}")
    return "\n\n".join(doc_strings)

async def generate_followups(query: str, sources: list) -> list:
    followup_messages = [
        {
            "role": "system",
            "content": "Based on the user's query and the chat context, generate exactly 3 short, natural follow-up questions (e.g. \"Want the architecture?\", \"Ask about the ML pipeline\"). Return ONLY a JSON array of 3 strings."
        },
        {
            "role": "user",
            "content": f"User query: {query}\nContext Sources: {sources}"
        }
    ]
    try:
        res = await groq_client.chat.completions.create(
            messages=followup_messages,
            model=settings.MODEL_NAME,
            temperature=0.7,
            stream=False,
        )
        text = res.choices[0].message.content
        import re
        cleaned = re.sub(r"```json\s*", "", text)
        cleaned = re.sub(r"```\s*", "", cleaned)
        followups = json.loads(cleaned)
        if isinstance(followups, list):
            return followups[:3]
    except Exception as e:
        logger.error(f"Failed to generate followups: {e}")
    return ["Tell me more", "What was the hardest part?", "What's the tech stack?"]

async def generate_chat_response_stream(query: str, mode: str = "engineer"):
    try:
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(search_kwargs={"k": 2})
        
        # Retrieve context for source attribution and logging
        docs = retriever.invoke(query)
        sources = list(set([doc.metadata.get("title", "Unknown") for doc in docs if doc.metadata.get("title")]))
        
        logger.info(f"Retrieved {len(docs)} documents")
        logger.info(f"Query: {query} | Mode: {mode} | Context Sources: {sources}")
        
        # Yield metadata (sources) first
        meta_data = json.dumps({"type": "meta", "sources": sources})
        yield f"data: {meta_data}\n\n"
        
        # Start follow-up generation concurrently to reduce latency
        followup_task = asyncio.create_task(generate_followups(query, sources))
        
        logger.info("Sending request to Groq SDK")
        
        context_str = format_docs(docs)
        
        messages = [
            {
                "role": "system",
                "content": get_system_prompt(mode) + f"\n\nContext:\n{context_str}"
            },
            {
                "role": "user",
                "content": query
            }
        ]
        
        # Stream chunks from the Groq client
        stream = await groq_client.chat.completions.create(
            messages=messages,
            model=settings.MODEL_NAME,
            temperature=0.3,
            stream=True,
        )
        
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                chunk_data = json.dumps({"type": "chunk", "content": chunk.choices[0].delta.content})
                yield f"data: {chunk_data}\n\n"
            
        followups = await followup_task
        followup_data = json.dumps({"type": "followup", "suggestions": followups})
        yield f"data: {followup_data}\n\n"
        
        yield "data: [DONE]\n\n"
    except Exception as e:
        logger.error(f"Error in chat stream: {str(e)}")
        error_data = json.dumps({"type": "error", "content": f"An error occurred: {str(e)}"})
        yield f"data: {error_data}\n\n"
        yield "data: [DONE]\n\n"
