# RAG Service Implementation Plan

**Created**: 2026-02-25
**Status**: Planning Phase - Ready for Agent Implementation

## Overview

Complete RAG-based knowledgebase service for Casey Key's portfolio chatbot. Following Jenny's guide: semantic search with embeddings, cosine similarity, and source citations.

## Current State

### ✅ Completed
- Knowledgebase structure created (`casey-key-knowledgebase.json` - 17 chunks)
- Capabilities summary created (`casey-key-capabilities.json`)
- Documentation created (README.md)
- Architecture defined (Portfolio → FAB → Service API → Knowledgebase)

### ❌ Not Yet Implemented
- **Embedding generation**: No actual OpenAI embeddings created
- **Vector database**: No vector storage set up
- **Similarity search**: No cosine similarity computation
- **Query API**: No working endpoint for search
- **Citation system**: No retrieval of chunks with scores

## Implementation Plan

### Phase 1: Core RAG Infrastructure

#### 1.1 Embedding Generation
**Task**: Generate vector embeddings for all knowledgebase chunks

**Approach Options**:
- **Option A (Recommended)**: OpenAI `text-embedding-3-small`
  - Pros: High quality, easy integration
  - Cons: ~$0.03 for 17 chunks, ongoing cost
  - Implementation: Use OpenAI API or local model (Ollama)

- **Option B (Local)**: Self-hosted embedding models
  - Pros: Zero API cost, local processing
  - Cons: Requires GPU/CPU resources, model hosting
  - Implementation: Ollama with `all-MiniLM-L6-v2` or similar

**Decision**: Start with Option A (OpenAI) for quick iteration, can switch to Option B later

**Tasks**:
```
[ ] Set up OpenAI API credentials
[ ] Create embedding generation script
[ ] Generate embeddings for all 17 chunks
[ ] Store embeddings in knowledgebase JSON or separate vectors.json
[ ] Add embedding vectors to chunk metadata (2436-dim for text-embedding-3-small)
```

**Tech Stack**:
- Python (embeddings)
- OpenAI API or Ollama (local)
- JSON storage

---

#### 1.2 Vector Database & Similarity Search
**Task**: Set up vector storage and cosine similarity computation

**Approach Options**:
- **Option A**: Pinecone/Weaviate/Qdrant (hosted)
  - Pros: Managed, scalable, easy setup
  - Cons: Ongoing cost, data hosted externally
  - Best for: Production with high query volume

- **Option B**: Local vector database (Chroma/Faiss)
  - Pros: Zero hosting cost, data stays local
  - Cons: Setup complexity, scaling limited by machine
  - Best for: Development, privacy-sensitive data

- **Option C**: Simple in-memory (NumPy)
  - Pros: Fastest for small datasets (<1000 chunks)
  - Cons: Doesn't scale, memory usage grows with data
  - Best for: MVP, 17 chunks current size

**Decision**: Start with Option B (Chroma) for development - local and simple

**Tasks**:
```
[ ] Install Chroma (or chosen vector DB)
[ ] Create vector storage initialization script
[ ] Implement cosine similarity function
[ ] Add search function to query vector DB
[ ] Return top-N results with similarity scores
[ ] Test semantic search with sample queries
```

**Tech Stack**:
- Python
- Chroma (or alternative: Qdrant, Weaviate)
- NumPy (for similarity computation)

---

### Phase 2: REST API Service

#### 2.1 Framework Setup
**Task**: Set up NestJS service with API endpoints

**Tasks**:
```
[ ] Initialize NestJS project (if not using neon-goals-service as template)
[ ] Create module structure (kb, embeddings, search, auth)
[ ] Set up CORS for portfolio site integration
[ ] Configure environment variables (.env)
[ ] Set up Prisma (or SQLAlchemy) for vector DB
```

**Tech Stack**:
- NestJS (already familiar from neon-goals-service)
- TypeScript
- Prisma ORM (or TypeORM with vector DB)
- Swagger/OpenAPI documentation

---

#### 2.2 API Endpoints

**Query Endpoints**:
```typescript
// kb.controller.ts
POST /kb/query
  Body: { query: string, limit?: number, tags?: string[] }
  Response: { chunks: Chunk[], query: string, searchTimeMs: number }

POST /kb/similar
  Body: { chunkId: number, limit?: number }
  Response: { chunks: Chunk[], similarityScores: number[] }
```

**Health & Stats Endpoints**:
```typescript
GET /kb/health
  Response: { status: 'healthy', vectorDbStatus: string, totalChunks: number }

GET /kb/stats
  Response: { totalChunks: number, totalTags: number, categories: object }
```

**Management Endpoints**:
```typescript
POST /kb/chunks
  Body: { content: string, tags: string[], source: string, metadata: object }
  Response: { chunk: Chunk, embeddingGenerated: boolean }

PUT /kb/chunks/:id
  Body: { content?: string, tags?: string[], metadata?: object }
  Response: { chunk: Chunk }

DELETE /kb/chunks/:id
  Response: { success: boolean }
```

---

### Phase 3: Portfolio Integration

#### 3.1 FAB Button Component
**Task**: Create Floating Action Button for portfolio site

**Location**: Add to portfolio's hero section or navigation

**Code Structure**:
```jsx
// src/components/CaseyChatButton.jsx
import React from 'react';

const CaseyChatButton = () => {
  const openChatWidget = () => {
    // Create or open chat widget
    window.dispatchEvent(new CustomEvent('open-casey-chat'));
  };

  return (
    <FloatingActionButton
      icon={<ChatIcon />}
      onClick={openChatWidget}
      tooltip="Chat with Casey's AI Assistant"
      position="bottom-right"
      badge="New"
    />
  );
};
```

**Tasks**:
```
[ ] Create FAB component in portfolio (if not exists)
[ ] Add chat widget container/modal
[ ] Style to match portfolio design (Tailwind)
[ ] Test button click opens chat interface
```

---

#### 3.2 Chat Widget Integration
**Task**: Build interactive chat interface on portfolio site

**Features**:
- User query input
- Display AI responses with markdown rendering
- Show source citations with similarity scores
- Loading states
- Error handling
- Conversation context (session tracking)

**Code Structure**:
```jsx
// src/components/ChatWidget.jsx
import React, { useState, useEffect } from 'react';

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userQuery) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://your-rag-service.com/kb/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery, limit: 5 })
      }).then(r => r.json());

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: formatResponseWithCitations(response.chunks),
        citations: response.chunks.map(c => ({
          source: c.source,
          similarity: c.similarity_score
        }))
      }]);
    } catch (error) {
      console.error('Query failed:', error);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
      </div>
      <div className="chat-input">
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask about Casey's work..."
          disabled={isLoading}
        />
        <button onClick={() => sendMessage(query)} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

// Helper to format response with citations
const formatResponseWithCitations = (chunks) => {
  let responseText = '';
  
  chunks.forEach((chunk, idx) => {
    responseText += chunk.content + '\n\n';
    responseText += `**Source**: ${chunk.source} (similarity: ${chunk.similarity_score.toFixed(2)})\n`;
    if (idx < chunks.length - 1) {
      responseText += '---\n';
    }
  });
  
  return responseText;
};
```

**Tasks**:
```
[ ] Create chat widget component structure
[ ] Implement query state management
[ ] Add citation formatting helper
[ ] Style to match portfolio design
[ ] Handle loading/error states
[ ] Test queries end-to-end with real RAG service
```

---

### Phase 4: Deployment & Integration

#### 4.1 Environment Configuration
**Task**: Set up deployment environment

**Required Environment Variables**:
```env
# RAG Service
RAG_SERVICE_URL=https://your-service-domain.com
RAG_SERVICE_API_KEY=your_service_api_key_here

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-proj-...
EMBEDDING_MODEL=text-embedding-3-small
```

---

#### 4.2 Deployment Options

**Option A: Vercel (Recommended for Portfolio Integration)**
- Free tier includes serverless functions
- Easy portfolio integration
- Automatic HTTPS
- Global edge deployment

**Steps**:
```
[ ] Create Vercel project
[ ] Set up vercel.json config
[ ] Connect GitHub repository
[ ] Configure environment variables in Vercel dashboard
[ ] Deploy
[ ] Update portfolio FAB button URL
```

**Option B: Railway/Render**
- Simple deployment
- Persistent database
- Auto HTTPS

**Option C: Self-hosted (VPS + Nginx)**
- Full control
- Custom domain
- Can use GPU for local embeddings

---

## Implementation Order

**Recommended Sequence**:
1. ✅ Phase 1.1 - Embedding generation (Option A: OpenAI)
2. ✅ Phase 1.2 - Vector database setup (Option B: Chroma - local)
3. ✅ Phase 2.1 - NestJS service framework
4. ✅ Phase 2.2 - API endpoints implementation
5. ✅ Phase 3.1 - Portfolio FAB button
6. ✅ Phase 3.2 - Chat widget on portfolio
7. ✅ Phase 4.1 - Vercel deployment

## Success Criteria

### Functional Requirements
- ✅ User can query with natural language
- ✅ Returns top 3-5 relevant chunks with citations
- ✅ Similarity scores (0.0-1.0) displayed for each chunk
- ✅ Sources clearly identified (project/experience/education)
- ✅ Response time < 500ms for local queries
- ✅ Chat widget opens from portfolio FAB button
- ✅ Markdown rendering of responses
- ✅ Error handling with user-friendly messages

### Technical Requirements
- ✅ Embeddings stored efficiently (JSON or vector DB)
- ✅ Cosine similarity computation accurate
- ✅ API CORS configured for portfolio cross-origin requests
- ✅ Service deployed and accessible via HTTPS
- ✅ Health endpoint returns 200 with status

## Open Questions

1. **Hosting**: Should we use Vercel (free, portfolio-friendly) or Railway (persistent DB)?
2. **Embeddings**: OpenAI API or local Ollama? (Ollama = free but requires GPU)
3. **Vector DB**: Chroma (local, simple) or Qdrant (more features, hosted)?
4. **Chat Widget**: Should it be a floating widget, modal, or slide-out panel?
5. **Citations Format**: How should sources be displayed? Footnotes, inline, or badges?
6. **Conversation Memory**: Should the service track conversation history, or just stateless queries?

## Notes

- This plan can be executed by an AI coding agent (Cursor, etc.)
- All code should be well-documented with comments
- Follow Jenny's RAG guide principles throughout
- Test each phase before moving to next
- Update this plan as implementation progresses

---

**Plan Version**: 1.0
**Created by**: AI Assistant (planning phase)
**Next**: Agent implementation of all phases
