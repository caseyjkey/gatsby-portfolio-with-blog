# RAG Service Implementation Guide

**Created**: 2026-02-25
**Status**: Complete Implementation Guide
**Based on**: [Jenny's RAG Guide](https://buildtolaunch.substack.com/p/ai-second-brain-rag-guide)

## Table of Contents

1. [Overview](#overview)
2. [Jenny's RAG Principles](#jennys-rag-principles)
3. [Architecture Decisions](#architecture-decisions)
4. [Phase 1: Content & Embeddings](#phase-1-content--embeddings)
5. [Phase 2: Vector Database & Search](#phase-2-vector-database--search)
6. [Phase 3: REST API Service](#phase-3-rest-api-service)
7. [Phase 4: Portfolio Integration](#phase-4-portfolio-integration)
8. [Code Templates](#code-templates)
9. [Deployment Guide](#deployment-guide)

---

## Overview

This guide provides a complete implementation path for building Casey Key's RAG-based portfolio chatbot. Following Jenny's three-phase approach with pgvector (PostgreSQL extension) for efficient, production-ready deployment.

**Current State**:
- ✅ Knowledgebase created (`casey-key-knowledgebase.json` - 17 chunks)
- ✅ Capabilities summary created (`casey-key-capabilities.json`)
- ✅ Architecture documented (`README.md`)
- ❌ RAG infrastructure needs implementation (embeddings, vector DB, API service)

---

## Jenny's RAG Principles

### 1. Smarter Search (Not Keywords)

**The Problem with Keyword Search**:
```javascript
// Keyword search only finds exact matches
const results = chunks.filter(c => 
  c.content.toLowerCase().includes(query.toLowerCase())
);
// Query: "distributed systems"
// Misses: "HPC", "MPI", "parallel computing", "high performance"
```

**The RAG Solution**:
```python
# Semantic search finds related concepts
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Convert text to embedding vector
query_vector = openai.embeddings.create(query)

# Find similar chunks (returns similarity 0.0-1.0)
similarities = [
    cosine_similarity(query_vector, chunk_vector)
    for chunk_vector in chunk_embeddings
]

# Query: "distributed systems"
# Returns: "HPC" (0.85), "MPI" (0.82), "CUDA" (0.78), "parallel" (0.75)
# Semantic understanding, not exact matching
```

**Key Insight**: RAG understands meaning and intent, not just word matching.

---

### 2. Context Preservation

**Jenny's Recommendation**: 500-word chunks with 50-word overlaps

```python
# Bad: Too small (fragmented)
chunks = [
    text[0:100],   # "Casey is a..."
    text[100:200],  # "...Software Engineer..."
    text[200:300],  # "...specializing in..."
]
# Query: "What experience does Casey have with Django?"
# Returns fragmented pieces, no full picture

# Good: Preserved meaning
chunks = [
    text[0:400],   # "Casey is a Software Engineer specializing..."
    text[400:800],   # "...in Distributed Systems and High-Performance applications."
    text[800:1200],  # "Based in California, Casey applies..."
    # 50-word overlap ensures no context loss between chunks
]
```

**Why 500 words?**
- Preserves sentence structure and paragraph flow
- Overlaps prevent loss at boundaries
- Balance between specificity and context window

---

### 3. Grounded Responses with Citations

**Always Include Sources**:
```json
{
  "chunks": [
    {
      "id": 2,
      "source": "portfolio_projects",
      "source_type": "portfolio",
      "content": "Spirit Beads E-Commerce Platform...",
      "similarity_score": 0.87,
      "metadata": {...}
    }
  ],
  "query": "Tell me about Casey's e-commerce platform"
}
```

**Display Format**:
```markdown
Based on portfolio_projects (similarity: 0.87):

Spirit Beads E-Commerce Platform is a production-grade scalable e-commerce engine deployed at https://thebeadedcase.com. Built with Python, Django REST Framework, React 18, and TypeScript.

**Sources**:
- [portfolio_projects] (similarity: 0.87)
- [spirit-beads-service README] (similarity: 0.82)

**Why Citations Matter**:
1. **Trustworthiness** - Users can verify claims
2. **Attribution** - Proper credit to sources
3. **Context** - User sees where info comes from
4. **Exploration** - Click to read more from specific source

---

### 4. Local-First Architecture

**Jenny's Approach**: JSON storage, minimal API costs

```python
# Cost Analysis (text-embedding-3-small)
# 17 chunks × $0.0011 per 1K tokens ≈ $0.03 total
# vs. continuous OpenAI API calls = expensive

# Store embeddings once, reuse for all queries
with open('embeddings.json', 'w') as f:
    json.dump(all_embeddings, f)
```

**Benefits**:
- ✅ Zero runtime API costs for search
- ✅ Fast retrieval (local read vs network call)
- ✅ Data stays private and under your control
- ✅ Can switch embedding models without re-processing

---

### 5. User Experience is Everything

**Jenny's Insight**: Chat interface makes it feel human

```typescript
// Features that make AI feel natural
- Typing indicators ("..." while thinking)
- Streaming responses (don't wait for full answer)
- Markdown rendering (readable formatting)
- Source citations integrated into flow (not hidden)
- Quick loading states
```

**Avoid**:
- ❌ Waiting 10 seconds before showing anything
- ❌ Wall of text without formatting
- ❌ Citations hidden in tiny footnotes
- ❌ Robotic "Here is your answer" framing

**Do**:
- ✅ Smooth streaming markdown
- ✅ Natural conversational flow
- ✅ Sources clearly visible with similarity scores
- ✅ Professional formatting

---

## Architecture Decisions

### Tech Stack Selection

#### Vector Database: pgvector (PostgreSQL Extension)

**Why pgvector?**
- ✅ Single database (share existing production DB)
- ✅ Memory efficient (vectors stored on disk)
- ✅ SQL-based similarity search (no separate service)
- ✅ Scales with data volume automatically
- ✅ Survives server restarts
- ✅ You already have PostgreSQL production experience

**Alternatives Considered**:
- ❌ Chroma: Separate in-memory store (memory bloat)
- ❌ Qdrant: Extra service to manage and pay for
- ❌ Weaviate: More complex setup for single-developer use case

#### Embedding Model: OpenAI text-embedding-3-small

**Why this model?**
- ✅ 2,436 dimensions (good balance of accuracy/speed)
- ✅ Well-tested, reliable
- ✅ Fast enough for 17 chunks
- ✅ Cheap (~$0.03 one-time cost)
- ✅ Easy to switch to local models later if needed

#### API Framework: FastAPI (Python)

**Why FastAPI?**
- ✅ Minimal memory footprint
- ✅ Built-in async/await (perfect for AI APIs)
- ✅ Easy OpenAI SDK integration
- ✅ Simple deployment (Vercel/Railway)
- ✅ Automatic OpenAPI/Swagger documentation

**Alternatives Considered**:
- ❌ NestJS: Heavier, more boilerplate for simple API
- ❌ Express.js: Less structure, more manual setup

---

## Phase 1: Content & Embeddings

### Task 1.1: Generate Embeddings

**Goal**: Create 2,436-dimensional vectors for all 17 knowledgebase chunks

#### Option A: OpenAI API (Recommended)

```python
# scripts/generate_embeddings.py
import openai
import json

# Load knowledgebase
with open('casey-key-knowledgebase.json', 'r') as f:
    kb = json.load(f)

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Generate embeddings for all chunks
embeddings = {}
for chunk in kb['chunks']:
    text = chunk['content']
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    embeddings[chunk['id']] = response.data[0].embedding  # First embedding is the vector

# Save to embeddings.json
with open('embeddings.json', 'w') as f:
    json.dump(embeddings, f, indent=2)

print(f"✅ Generated {len(embeddings)} embeddings")
```

**Expected Output**:
```json
{
  "1": [0.234, 0.567, 0.890, ...],  // 2,436-dimensional vector
  "2": [0.123, 0.456, 0.789, ...],
  ...
}
```

---

#### Option B: Local Model (Ollama) - For Later

```python
# Later: Switch to zero-cost local embeddings
from openai import OpenAI
from ollama import Client

# Point to local Ollama instance
client = OpenAI(
    base_url='http://localhost:11434/v1',
    api_key='ollama'
)

# Use same embedding generation code
# Models: all-MiniLM-L6-v2 (small), nomic-embed-text (fast)
```

---

### Task 1.2: Update Knowledgebase Schema

**Goal**: Add `embedding` column to existing chunks structure

```sql
-- scripts/init_schema.sql

-- Add vector column to chunks table
ALTER TABLE kb_chunks 
ADD COLUMN embedding vector(2436);

-- Create index for vector similarity
CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx 
ON kb_chunks USING ivfflat (embedding vector_cosine_ops);

-- Verify
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE indexname = 'kb_chunks_embedding_idx';
```

**Updated Knowledgebase Format**:
```json
{
  "meta": { "chunk_size": 500, "embedding_model": "text-embedding-3-small" },
  "chunks": [
    {
      "id": 1,
      "content": "...",
      "tags": ["professional", "overview"],
      "embedding": [0.234, 0.567, 0.890, ...],  // NEW: 2,436-dim vector
      "metadata": { "category": "about", ... }
    }
  ]
}
```

---

## Phase 2: Vector Database & Search

### Task 2.1: Initialize pgvector Extension

```bash
# scripts/init_pgvector.sh

# Connect to your production database
psql -h localhost -U postgres -d your_database

# Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

# Verify
\dx
```

**Output**:
```
pgvector
---------
```

---

### Task 2.2: Load Knowledgebase into PostgreSQL

```python
# scripts/load_kb.py
import psycopg2
import json

# Load chunks
with open('casey-key-knowledgebase.json', 'r') as f:
    kb = json.load(f)

# Connect to database
conn = psycopg2.connect(
    "postgresql://user:pass@localhost/kb_database"
)

cursor = conn.cursor()

# Create table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS kb_chunks (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        tags TEXT[],
        metadata JSONB,
        source TEXT,
        source_type TEXT,
        embedding vector(2436)
    )
""")

# Insert all chunks with embeddings
for chunk in kb['chunks']:
    embedding = chunk.get('embedding')  # From embeddings.json
    cursor.execute("""
        INSERT INTO kb_chunks (content, tags, metadata, source, source_type, embedding)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        chunk['content'],
        chunk['tags'],
        json.dumps(chunk['metadata']),
        chunk['source'],
        chunk['source_type'],
        embedding
    ))

conn.commit()
cursor.close()

print(f"✅ Loaded {len(kb['chunks'])} chunks into pgvector")
```

---

### Task 2.3: Implement Semantic Search

**Goal**: Vector similarity search using pgvector

```python
# rag_service/search.py

import numpy as np
from scipy.spatial.distance import cosine

def search_similar(query_embedding, limit=5, conn):
    """Find most similar chunks using pgvector cosine similarity"""
    
    cursor = conn.cursor()
    
    # pgvector similarity search
    cursor.execute("""
        SELECT 
            id, content, source, source_type, metadata, tags,
            1 - (embedding <=> %s) as similarity_score
        FROM kb_chunks
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> %s  -- pgvector distance
        LIMIT %s
    """, (query_embedding, limit))
    
    results = cursor.fetchall()
    cursor.close()
    
    return [
        {
            'id': r[0],
            'content': r[1],
            'source': r[2],
            'similarity_score': float(1 - r[3]),  # Convert to similarity
            'tags': r[4],
            'metadata': json.loads(r[5])
        }
        for r in results
    ]

# Alternative: Using SQL function for cleaner queries
cursor.execute("""
    CREATE OR REPLACE FUNCTION search_chunks(query_text text)
    RETURNS TABLE (id, content, source, similarity_score)
    AS $$
    BEGIN
        SELECT 
            id, content, source, source_type, tags,
            1 - (embedding <=> $1::vector) as similarity_score
        FROM kb_chunks
        WHERE embedding IS NOT NULL
        ORDER BY similarity_score DESC
        LIMIT 5;
    END;
    $$ LANGUAGE SQL;
""")
```

**Query Example**:
```python
# Query from FastAPI
@router.post("/query")
async def query_knowledgebase(request: QueryRequest):
    # Generate query embedding (OpenAI or reuse cached)
    query_embedding = await generate_embedding(request.query)
    
    # Search pgvector
    results = await search_similar(query_embedding, limit=5, conn)
    
    return {
        "chunks": results,
        "query": request.query,
        "search_time_ms": calculate_time()
    }
```

---

## Phase 3: REST API Service

### Task 3.1: FastAPI Project Structure

```
rag_service/
├── main.py                 # FastAPI app entry point
├── models.py                # Pydantic models (Query, Response, Chunk)
├── database.py              # pgvector connection & queries
├── embeddings.py            # OpenAI embedding generation
├── load_kb.py              # Knowledgebase loader
└── requirements.txt           # Dependencies
```

---

### Task 3.2: API Endpoints

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import QueryRequest, QueryResponse, HealthResponse
from database import search_similar, get_stats
from embeddings import generate_query_embedding

app = FastAPI(title="Casey Key RAG Service")

# CORS for portfolio integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://keycasey.com"],
    allow_credentials=True
)

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        vector_db_status="pgvector",
        total_chunks=await get_total_chunks(),
        embedding_model="text-embedding-3-small"
    )

@app.get("/stats", response_model=StatsResponse)
async def get_kb_stats():
    cursor = await get_db_cursor()
    cursor.execute("SELECT COUNT(*) FROM kb_chunks WHERE embedding IS NOT NULL")
    total = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(DISTINCT unnest(tags)) FROM kb_chunks")
    total_tags = cursor.fetchone()[0]
    return StatsResponse(total_chunks=total, total_tags=total_tags)

@app.post("/query", response_model=QueryResponse)
async def query_knowledgebase(request: QueryRequest):
    # Generate embedding for query (cached if possible)
    query_vector = await generate_query_embedding(request.query)
    
    # Search pgvector
    results = await search_similar(query_vector, request.limit or 5, conn)
    
    return QueryResponse(
        chunks=results,
        query=request.query,
        search_time_ms=calculate_time()
    )

@app.get("/capabilities", response_model=CapabilitiesResponse)
async def get_capabilities():
    """Return full capabilities from capabilities JSON"""
    with open('casey-key-capabilities.json', 'r') as f:
        return json.load(f)
```

---

### Task 3.3: Run & Test Service

```bash
# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run embedding generation
python scripts/generate_embeddings.py

# Load into database
python scripts/load_kb.py

# Test queries
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What e-commerce projects has Casey built?"}'

# Expected response time: < 100ms for local pgvector
```

---

## Phase 4: Portfolio Integration

### Task 4.1: FAB Button Component

```jsx
// gatsby-portfolio-with-blog/src/components/CaseyChatButton.jsx
import React from 'react';

const CaseyChatButton = () => {
  const openChatWidget = () => {
    // Dispatch custom event that portfolio listens for
    window.dispatchEvent(new CustomEvent('open-casey-chat'));
  };

  return (
    <FloatingActionButton
      icon={<ChatIcon />}  // Simple chat icon SVG
      onClick={openChatWidget}
      tooltip="Chat with Casey's AI Assistant"
      position="bottom-right"
      badge={null}  // Or "New" if recently updated
    />
  );
};

export default CaseyChatButton;
```

---

### Task 4.2: Chat Widget Component

```jsx
// gatsby-portfolio-with-blog/src/components/ChatWidget.jsx
import React, { useState, useEffect } from 'react';

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Listen for open event from FAB button
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-casey-chat', handleOpen);
    
    return () => {
      window.removeEventListener('open-casey-chat', handleOpen);
    };
  }, []);

  const sendMessage = async (userQuery) => {
    if (!userQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('YOUR_RAG_SERVICE_URL/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          limit: 5
        })
      }).then(r => r.json());
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: formatResponseWithCitations(response.chunks)
      }]);
    } catch (error) {
      console.error('Query failed:', error);
      // Add error message
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Sorry, I couldn't process your request. Error: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponseWithCitations = (chunks) => {
    let responseText = '';
    
    chunks.forEach((chunk, idx) => {
      responseText += chunk.content + '\n\n';
      
      // Add citation with similarity score
      responseText += `**Source**: ${chunk.source} (similarity: ${chunk.similarity_score.toFixed(2)})\n`;
      
      if (idx < chunks.length - 1) {
        responseText += '---\n';
      }
    });
    
    return responseText;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 chat-widget-container">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded shadow-lg"
      >
        <ChatIcon className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      <div className="bg-white rounded-lg shadow-2xl max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Chat with Casey's AI Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-300">
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {msg.role === 'system' ? (
                  <div className="text-red-600">{msg.content}</div>
                ) : (
                  <>
                    {msg.role === 'user' && (
                      <div className="text-gray-500 text-xs mb-1">You</div>
                    )}
                    <div className="prose prose prose-sm max-w-none whitespace-pre-wrap">
                      {msg.role === 'assistant' && (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                      {msg.role === 'user' && (
                        <span>{msg.content}</span>
                      )}
                    </div>
                    {msg.role === 'assistant' && msg.citations && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Sources</h4>
                        {msg.citations.map((citation, cidx) => (
                          <div key={cidx} className="text-sm">
                            <span className="font-medium">{citation.source}</span>
                            <span className="text-gray-500 ml-2">
                              (similarity: {citation.similarity_score.toFixed(2)})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask about Casey's work, skills, or projects..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(query)}
            disabled={isLoading || !query.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:opacity-50"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
```

---

## Deployment Guide

### Option 1: Vercel (Recommended)

**Why Vercel for this project?**
- ✅ Free tier includes serverless functions
- ✅ Perfect for portfolio site integration (same stack: Gatsby + React)
- ✅ Automatic HTTPS and global edge deployment
- ✅ Easy environment variable management
- ✅ Zero infrastructure management

```bash
# Deploy
vercel deploy --prod

# Environment Variables (Vercel Dashboard)
# RAG_SERVICE_URL=https://your-service.vercel.app
# OPENAI_API_KEY=sk-...
# DATABASE_URL=postgresql://...
```

---

### Option 2: Railway (Persistent Database)

**Why Railway?**
- ✅ Built-in PostgreSQL support
- ✅ Simple Git push deployment
- ✅ Persistent storage (vectors don't disappear on restart)
- ✅ Good for pgvector (full database access)

```bash
# Deploy
railway up

# Environment Variables (Railway Dashboard)
# POSTGRES_URL=postgresql://...
# OPENAI_API_KEY=sk-...
```

---

### Option 3: Self-Hosted (VPS)

**When self-hosting:**
- Use systemd for auto-restart
- Configure nginx as reverse proxy
- Set up SSL with Let's Encrypt
- Monitor with basic auth

```ini
# /etc/systemd/systemd/rag-service.service
[Unit]
Description=Casey Key RAG Service
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/rag-service
Environment="DATABASE_URL=postgresql://..."
ExecStart=/usr/bin/uvicorn main:app --host 0.0.0.0
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## Code Templates

### Dependencies

```bash
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.23.2
psycopg2-binary==2.9.9
openai==1.3.7
python-dotenv==1.0.0
numpy==1.24.3
scipy==1.10.1
```

### Environment Variables

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/casey_kb
OPENAI_API_KEY=sk-proj-your-key-here
CORS_ORIGINS=https://keycasey.com
```

---

## Testing & Validation

### Test Queries

```bash
# Test semantic understanding
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What parallel computing projects has Casey built?"}'

# Test tag filtering
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "projects", "tags": ["hpc", "cuda"]}'

# Expected: Returns CUDA, OpenMP, MPI projects (similarity 0.75+)
```

### Success Criteria

- ✅ Semantic search works (meaning-based, not keywords)
- ✅ Returns top 5 chunks with citations
- ✅ Similarity scores in range 0.5-1.0 for relevant content
- ✅ Query time < 100ms for local pgvector
- ✅ Chat widget integrates with portfolio
- ✅ Citations displayed with source and similarity
- ✅ Markdown rendering for readable responses
- ✅ Handles errors gracefully

---

## Maintenance & Updates

### Adding New Content

1. **Update knowledgebase JSON**: Add new chunk to `casey-key-knowledgebase.json`
2. **Regenerate embedding**: Run `generate_embeddings.py`
3. **Reload database**: No need - pgvector handles live updates
4. **Test**: Verify new content appears in queries

### Monitoring

```python
# Simple health check
@app.get("/health")
async def health():
    try:
        # Test database connection
        cursor.execute("SELECT 1")
        return {"status": "healthy", "db_status": "connected"}
    except:
        return {"status": "unhealthy", "db_status": "disconnected", "error": str(e)}
```

---

## References

- **Jenny's RAG Guide**: https://buildtolaunch.substack.com/p/ai-second-brain-rag-guide
- **OpenAI API**: https://platform.openai.com/docs/guides/embeddings
- **pgvector Documentation**: https://github.com/pgvector/pgvector
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Portfolio Site**: https://keycasey.com
- **DevPost**: https://devpost.com/CaseyJKey

---

**Status**: ✅ Complete implementation guide ready for agent execution

**Next Steps**:
1. Choose deployment option (Vercel/Railway/Self-hosted)
2. Generate embeddings for all 17 chunks (~$0.03 one-time)
3. Implement FastAPI service with pgvector integration
4. Create portfolio FAB button and ChatWidget components
5. Test end-to-end: portfolio → FAB → service → response
6. Deploy and verify

---

**Built following Jenny's complete RAG principles**:
1. ✅ Smarter search (semantic meaning vs keywords)
2. ✅ Context preservation (500-word chunks with overlaps)
3. ✅ Grounded responses (source citations with similarity scores)
4. ✅ Local-first architecture (JSON storage, pgvector)
5. ✅ User experience matters (natural chat interface with markdown)

**Architecture**: Portfolio (Gatsby) → FAB Button → FastAPI Service → pgvector → Knowledgebase
