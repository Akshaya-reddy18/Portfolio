import json
import os
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from core.config import settings

def get_vector_store():
    # Groq does not have a native embeddings API.
    # Using HuggingFace's local embeddings (free and fast) to stay consistent with the free Groq API.
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = Chroma(
        collection_name="portfolio",
        embedding_function=embeddings,
        persist_directory=settings.CHROMA_DB_DIR,
    )
    return vector_store

def ingest_portfolio_data(json_path: str):
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"Portfolio data not found at {json_path}")
        
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} items from {json_path}")
    
    # Delete existing collection to avoid duplicates on re-indexing
    try:
        store_to_clear = get_vector_store()
        store_to_clear.delete_collection()
        print("Previous collection cleared.")
    except Exception as e:
        print(f"Could not clear previous collection (might not exist): {e}")

    documents = []
    
    for item in data:
        item_type = item.get('type', 'unknown')
        title_or_name = item.get('title', item.get('name', 'Untitled'))
        
        # Build comprehensive content string
        content_parts = [
            f"Type: {item_type.capitalize()}",
            f"Title: {title_or_name}"
        ]
        
        if item.get('company'): content_parts.append(f"Company: {item['company']}")
        if item.get('duration'): content_parts.append(f"Duration: {item['duration']}")
        if item.get('category'): content_parts.append(f"Category: {item['category']}")
        if item.get('stack'): content_parts.append(f"Stack: {', '.join(item['stack'])}")
        if item.get('tags'): content_parts.append(f"Tags: {', '.join(item['tags'])}")
        if item.get('description'): content_parts.append(f"Description: {item['description']}")
        if item.get('impact'): content_parts.append(f"Impact: {item['impact']}")
        if item.get('details'): content_parts.append(f"Details: {item['details']}")
        if item.get('challenges'): content_parts.append(f"Challenges: {item['challenges']}")
        if item.get('solutions'): content_parts.append(f"Solutions: {item['solutions']}")
        
        page_content = "\n".join(content_parts)
        
        # Build metadata (Chroma requires str, int, float, bool)
        metadata = {
            "type": str(item_type),
            "title": str(title_or_name),
            "category": str(item.get('category', 'None'))
        }
        
        if item.get('stack'):
            metadata["stack"] = ", ".join(item['stack'])
        if item.get('tags'):
            metadata["tags"] = ", ".join(item['tags'])
            
        documents.append(Document(page_content=page_content, metadata=metadata))
        
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    splits = text_splitter.split_documents(documents)
    
    # Re-instantiate after deletion
    vector_store = get_vector_store()
    vector_store.add_documents(splits)
    print(f"Ingestion complete. Added {len(splits)} chunks to Vector Store.")
