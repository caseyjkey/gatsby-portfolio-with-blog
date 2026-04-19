# RAG Service Complete Implementation Guide

Based on Jenny's [AI Second Brain RAG Guide](https://buildtolaunch.substack.com/p/ai-second-brain-rag-guide), this is a comprehensive implementation guide for building a portfolio chatbot using Retrieval-Augmented Generation.

---

## Table of Contents

1. [What is RAG?](#what-is-rag)
2. [Architecture Overview](#architecture-overview)
3. [Phase 1: Content Processing](#phase-1-content-processing)
4. [Phase 2: Embeddings & Search](#phase-2-embeddings--search)
5. [Phase 3: Chat Interface](#phase-3-chat-interface)
6. [Data Sources](#data-sources)
7. [Implementation](#implementation)
8. [Cost Analysis](#cost-analysis)

---

## What is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique that combines semantic search with language models to provide grounded, accurate responses.

### How it Works

Unlike keyword search which only finds exact word matches, RAG understands **meaning**:

| Keyword Search | RAG Search |
|----------------|------------|
| Finds: documents with the word "dog" | Finds: "puppies", "canines", "golden retrievers", pet care, training, veterinarians |
| Exact match required | Semantic understanding |

The famous linguistic principle applies here:

> *"You shall know a word by the company it keeps."*

**RAG Process:**
1. User asks a question
2. Question is converted to a meaning-code (embedding)
3. System finds content with similar meanings
4. Context is fed into a language model
5. Grounded response is generated

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    DATA SOURCES                         │
│  GitHub | DevPost | Portfolio | Blog                    │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              CONTENT PROCESSING                          │
│  • Fetch content automatically                         │
│  • Break into 500-word chunks                          │
│  • Extract metadata (title, URL, date, tags)            │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              EMBEDDINGS GENERATION                       │
│  • OpenAI text-embedding-3-small                        │
│  • 2,436-dimensional vectors per chunk                  │
│  • Cosine similarity for matching                       │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              LOCAL STORAGE (JSON)                        │
│  • Minimal API costs                                   │
│  • Fast retrieval                                      │
│  • Easy to update                                      │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              CHAT INTERFACE                              │
│  • Floating widget on portfolio                        │
│  • Markdown rendering                                  │
│  • Source citations with similarity scores              │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: Content Processing

### Chunking Strategy

**Why 500-word chunks with 50-word overlaps?**

- **Too small**: Lose context, fragments lose meaning
- **Too large**: Results get fuzzy, less precise matching
- **500 words with 50-word overlap**: Sweet spot that preserves meaning while keeping search sharp

### Metadata Extraction

For each chunk, extract:
- **Title**: Source document title
- **URL**: Source URL for citation
- **Date**: Publication date
- **Tags**: Topic/category tags

### Example: Content Processing Script

```javascript
// scripts/process-content.js
import { fetchGitHubRepos } from './scrapers/github.js';
import { fetchDevPostProjects } from './scrapers/devpost.js';
import { fetchPortfolioContent } from './scrapers/portfolio.js';
import { fetchBlogPosts } from './scrapers/blog.js';
import { chunkText } from './utils/chunker.js';
import { extractMetadata } from './utils/metadata.js';

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

async function processAllSources() {
  // Fetch from all sources
  const githubContent = await fetchGitHubRepos('caseyjkey');
  const devpostContent = await fetchDevPostProjects('caseyjkey');
  const portfolioContent = await fetchPortfolioContent('https://yourportfolio.com');
  const blogContent = await fetchBlogPosts('https://yourportfolio.com/blog');

  // Combine all content
  const allContent = [
    ...githubContent,
    ...devpostContent,
    ...portfolioContent,
    ...blogContent
  ];

  // Process into chunks
  const chunks = allContent.flatMap(content => {
    const textChunks = chunkText(content.text, CHUNK_SIZE, CHUNK_OVERLAP);
    return textChunks.map((chunk, index) => ({
      id: `${content.source}-${content.id}-${index}`,
      text: chunk,
      metadata: extractMetadata(content, index)
    }));
  });

  return chunks;
}

// Example chunk text function
export function chunkText(text, size, overlap) {
  const chunks = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += (size - overlap)) {
    const chunk = words.slice(i, i + size).join(' ');
    chunks.push(chunk);
    
    if (i + size >= words.length) break;
  }
  
  return chunks;
}
```

---

## Phase 2: Embeddings & Search

### Embedding Model

**OpenAI text-embedding-3-small**
- Cost-effective: ~$0.03 for all content
- 2,436-dimensional vectors
- High quality semantic understanding

### Similarity Search

**Cosine Similarity**: Measures the cosine of the angle between two vectors

```
similarity = (A · B) / (||A|| × ||B||)
```

Higher scores = better matches (typical range: 0.3–0.8)

### Example: Embeddings Generation

```javascript
// scripts/generate-embeddings.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  
  return response.data[0].embedding;
}

export async function generateAllEmbeddings(chunks) {
  const embeddings = [];
  
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.text);
    embeddings.push({
      id: chunk.id,
      text: chunk.text,
      embedding: embedding,
      metadata: chunk.metadata
    });
  }
  
  return embeddings;
}

// Save to JSON for local storage
export async function saveToJSON(embeddings, filePath) {
  const fs = await import('fs/promises');
  await fs.writeFile(filePath, JSON.stringify(embeddings, null, 2));
}
```

### Example: Semantic Search

```javascript
// scripts/search.js
import { generateEmbedding } from './generate-embeddings.js';

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function search(query, embeddings, topK = 5) {
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query);
  
  // Calculate similarities
  const results = embeddings.map(embedding => ({
    ...embedding,
    similarity: cosineSimilarity(queryEmbedding, embedding.embedding)
  }));
  
  // Sort by similarity and return top K
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}
```

---

## Phase 3: Chat Interface

### Key Features

- ✅ **Floating chat widget** - Non-intrusive, always accessible
- ✅ **Natural conversation** - Contextual responses
- ✅ **Markdown rendering** - Readable, formatted output
- ✅ **Source citations** - Users know where information comes from
- ✅ **Similarity scores** - Transparency in matching quality

### Example: React Chat Widget

```tsx
// src/components/ChatWidget.tsx
import React, { useState } from 'react';
import { search } from '../scripts/search.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default function ChatWidget() {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{ title: string; url: string; similarity: number }>;
  }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);

    // Search for relevant content
    const results = await search(input, embeddings, 3);

    // Build context from search results
    const context = results.map(r => r.text).join('\n\n');
    const sources = results.map(r => ({
      title: r.metadata.title,
      url: r.metadata.url,
      similarity: r.similarity
    }));

    // Generate response with context
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant answering questions about Casey's work. 
          Use the following context to answer. If the answer isn't in the context, say so.
          
          Context:
          ${context}`
        },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        userMessage
      ]
    });

    const assistantMessage = {
      role: 'assistant' as const,
      content: completion.choices[0].message.content || '',
      sources
    };

    setMessages(prev => [...prev, assistantMessage]);
    setInput('');
    setLoading(false);
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border">
      <div className="bg-gray-900 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold">Ask about my work</h3>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.sources && (
                <div className="mt-2 pt-2 border-t text-xs">
                  <p className="font-semibold">Sources:</p>
                  {msg.sources.map((source, j) => (
                    <div key={j} className="flex items-center gap-2 mt-1">
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {source.title}
                      </a>
                      <span className="text-gray-500">
                        ({(source.similarity * 100).toFixed(0)}% match)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-500">
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my projects, skills, experience..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## Data Sources

### GitHub

```javascript
// scripts/scrapers/github.js
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function fetchGitHubRepos(username) {
  const repos = await octokit.rest.repos.listForUser({
    username,
    sort: 'updated',
    per_page: 100
  });

  return Promise.all(repos.data.map(async repo => {
    // Fetch README
    let readme = '';
    try {
      const readmeResponse = await octokit.rest.repos.getReadme({
        owner: username,
        repo: repo.name
      });
      readme = Buffer.from(readmeResponse.data.content, 'base64').toString();
    } catch (e) {
      // No README
    }

    return {
      source: 'github',
      id: repo.id,
      url: repo.html_url,
      title: repo.name,
      description: repo.description || '',
      text: `${repo.name}\n\n${repo.description}\n\n${readme}`,
      metadata: {
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: repo.updated_at
      }
    };
  }));
}
```

### DevPost

```javascript
// scripts/scrapers/devpost.js
import puppeteer from 'puppeteer';

export async function fetchDevPostProjects(username) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`https://devpost.com/${username}`);
  
  const projects = await page.evaluate(() => {
    const projectCards = Array.from(document.querySelectorAll('.software-project-item'));
    return projectCards.map(card => ({
      title: card.querySelector('.software-project-name')?.textContent || '',
      description: card.querySelector('.small-tagline')?.textContent || '',
      url: card.querySelector('a.software-project-link')?.href || '',
      likes: card.querySelector('.like-count')?.textContent || '0'
    }));
  });
  
  await browser.close();
  
  return projects.map(project => ({
    source: 'devpost',
    id: project.url.split('/').pop(),
    url: project.url,
    title: project.title,
    text: `${project.title}\n\n${project.description}`,
    metadata: {
      likes: parseInt(project.likes),
      platform: 'DevPost'
    }
  }));
}
```

### Portfolio & Blog

```javascript
// scripts/scrapers/portfolio.js
import { fetch } from 'undici';

export async function fetchPortfolioContent(baseUrl) {
  const response = await fetch(baseUrl);
  const html = await response.text();
  
  // Extract content from portfolio pages
  // This depends on your portfolio structure
  // Customize based on your Gatsby site's data structure
  
  return [{
    source: 'portfolio',
    id: 'home',
    url: baseUrl,
    title: 'Portfolio Home',
    text: extractTextContent(html), // Implement text extraction
    metadata: {
      type: 'page'
    }
  }];
}
```

---

## Implementation

### Setup

```bash
# Install dependencies
npm install openai @octokit/rest puppeteer undici
npm install -D typescript @types/node

# Create environment variables
echo "OPENAI_API_KEY=your_key_here" > .env
echo "GITHUB_TOKEN=your_token_here" >> .env
```

### Directory Structure

```
portfolio-site/
├── docs/
│   └── RAG-SERVICE-COMPLETE-GUIDE.md  ← This file
├── scripts/
│   ├── generate-embeddings.js
│   ├── search.js
│   └── scrapers/
│       ├── github.js
│       ├── devpost.js
│       ├── portfolio.js
│       └── blog.js
├── src/
│   └── components/
│       └── ChatWidget.tsx
└── data/
    └── embeddings.json
```

### Build Pipeline

```bash
# Step 1: Process content from all sources
node scripts/process-content.js > data/raw-chunks.json

# Step 2: Generate embeddings
node scripts/generate-embeddings.js data/raw-chunks.json data/embeddings.json

# Step 3: Build the site with chat widget
npm run build
```

### Environment Variables

```env
# .env
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...

# For GitHub token: https://github.com/settings/tokens
# For OpenAI API key: https://platform.openai.com/api-keys
```

---

## Cost Analysis

### Jenny's Results (30+ articles)

| Metric | Value |
|--------|-------|
| Articles processed | 30+ |
| Chunks generated | 250 |
| Vectors per chunk | 2,436 dimensions |
| Embedding cost | ~$0.03 |
| Response time | Seconds |
| Similarity scores | 0.3–0.8 |
| Hallucinations | Zero (all grounded) |

### Cost Breakdown

**text-embedding-3-small pricing**: ~$0.00002 per 1K tokens

For a typical portfolio with:
- 50 GitHub repos
- 10 DevPost projects
- 20 blog posts
- 5 portfolio pages

Estimated: **~$0.05–$0.10 total** for initial setup

### Ongoing Costs

- **Chat responses**: GPT-4 API usage (per query)
- **Updates**: Re-embedding when content changes (rare)
- **Storage**: Local JSON (free)

---

## Best Practices

### 1. Grounded Responses Only

Always include citations so users can verify information:

```javascript
{
  role: 'assistant',
  content: 'Casey has experience with React, Node.js, and Python...',
  sources: [
    { title: 'GitHub: portfolio-react', url: '...', similarity: 0.82 },
    { title: 'DevPost: AI Assistant', url: '...', similarity: 0.75 }
  ]
}
```

### 2. Handle Unknown Queries

If the answer isn't in your content, be honest:

```javascript
{
  role: 'assistant',
  content: "I don't have information about that in my knowledge base. Would you like me to tell you about Casey's web development projects instead?",
  sources: []
}
```

### 3. Regular Updates

Set up a cron job to re-scrape and re-embed periodically:

```bash
# Run weekly to update content
0 2 * * 0 cd /path/to/portfolio && npm run rag-update
```

### 4. Privacy Considerations

- Don't scrape private repositories
- Respect robots.txt
- Store embeddings locally
- No data leaves your control

---

## Next Steps

1. ✅ **Set up API keys** (OpenAI, GitHub)
2. ✅ **Implement scrapers** for your data sources
3. ✅ **Build content processing pipeline**
4. ✅ **Generate embeddings and save to JSON**
5. ✅ **Build React chat widget**
6. ✅ **Test with sample queries**
7. ✅ **Deploy to production**
8. ✅ **Monitor and improve**

---

## Troubleshooting

### Issue: Low similarity scores (< 0.3)

**Solution**: Check your chunking strategy. Too-small chunks lose context.

### Issue: Hallucinations

**Solution**: Ensure your system prompt explicitly says to only use the provided context.

### Issue: Slow responses

**Solution**: Pre-generate embeddings. Only generate query embeddings in real-time.

### Issue: Missing content

**Solution**: Verify all data sources are being scraped correctly. Check API rate limits.

---

## Resources

- [Jenny's RAG Guide](https://buildtolaunch.substack.com/p/ai-second-brain-rag-guide)
- [OpenAI Embeddings Documentation](https://platform.openai.com/docs/guides/embeddings)
- [OpenAI Pricing](https://openai.com/pricing)
- [Astro Documentation](https://docs.astro.build)

---

**Created**: 2026-03-14  
**Based on**: Jenny's "AI Second Brain RAG Guide"  
**For**: Casey Key's Portfolio Chatbot  
