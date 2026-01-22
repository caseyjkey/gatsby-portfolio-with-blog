# Active Todos

**Last Updated:** 2026-01-22
**Current Focus:** Portfolio Quick Wins → Scholarships Plus

---

## Week 1: Portfolio Quick Wins

### 1. Add Spirit Beads to Portfolio ⚡ IN PROGRESS
**Status:** In Progress
**Priority:** High (helps mom immediately)

**Tasks:**
- [ ] Create Spirit Beads project directory (`src/data/projects/spiritbeads/`)
- [ ] Create `project.json` with all details
- [ ] Add project image (screenshot or logo)
- [ ] Test project card rendering

**Need from user:**
- Spirit Beads URL/domain
- Description of what it does
- Tech stack to showcase
- Any screenshots/images

---

### 2. Design & Implement Project Status Badge System
**Status:** Pending
**Priority:** Medium

**Proposed Status Values:**
- `live` - Has live URL (not just GitHub), currently deployed
- `launched` - Completed in past, only GitHub link available
- `in-progress` - `end.present: true` in project.json
- `defunct` - No longer maintained (manual override)
- `iot` - Physical/IoT project (manual override)

**Tasks:**
- [ ] Add `status` field to project.json schema (optional, auto-detect if missing)
- [ ] Create status badge component in `Project.tsx`
- [ ] Add badge styles (color-coded: green=live, blue=launched, yellow=in-progress, gray=defunct)
- [ ] Update all existing projects with status if needed (for edge cases)
- [ ] Test badge rendering on project cards

**Auto-detection logic:**
```
if manual status exists → use manual value
else if end.present === true → "in-progress"
else if link exists AND link doesn't contain "github" → "live"
else if end.date exists → "launched"
else → "in-progress"
```

---

### 3. Fix Header/Resume Accordion Scroll Bug
**Status:** Pending
**Priority:** Medium (quality signal)

**Bug Description:**
- Accordion scroll sometimes leaves blank space above section
- Header doesn't always drop into view when expected
- Smart header behavior conflicts with accordion scrolling

**Tasks:**
- [ ] Reproduce the bug
- [ ] Identify root cause (header state vs scroll position)
- [ ] Implement fix
- [ ] Test all accordion sections

---

### 4. Convert Logo to SVG
**Status:** Pending
**Priority:** Low-Medium

**Tasks:**
- [ ] Locate current logo file
- [ ] Convert to SVG format
- [ ] Add cutout effect
- [ ] Make "Casey" text single-color
- [ ] Update logo references in code
- [ ] Test rendering across browsers

---

### 5. Add Githubly to Portfolio
**Status:** Pending
**Priority:** Medium

**Tasks:**
- [ ] Create Githubly project directory
- [ ] Create `project.json` with details
- [ ] Add project image
- [ ] Set status to "in-progress" or "Launching February 2025"
- [ ] Test project card rendering

**Content:** (Already documented in roadmap)
- SaaS for GitHub brand optimization
- 4 features: contribution graph, repo organizer, profile README, repo populator
- Tech: Next.js, TypeScript, Prisma + Postgres, Docker, pm2, bun, Z.ai LLM APIs

---

## Week 2-7: Scholarships Plus

### 6. Scholarships Plus - RAG-Powered Scholarship Assistant ⏰
**Status:** Pending (starts Week 2)
**Priority:** URGENT (deadline: March/April)

**Tech Stack:**
- Remix (web framework)
- PostgreSQL (database)
- LLM + Langchain (RAG pipeline)
- Pinecone (vector embeddings)

**Available Resources:**
- 18+ scholarship essays for RAG training (6+ years × 3+ per year)
- Data sources: Email lists, memory, scholarship websites

**MVP Tasks (Weeks 2-5):**
- [ ] Set up Remix project
- [ ] Set up PostgreSQL database
- [ ] Implement Langchain RAG pipeline
- [ ] Set up Pinecone vector embeddings
- [ ] Create essay data ingestion from previous essays
- [ ] Build scholarship tracker (Native American focused)
- [ ] Implement basic CRUD for scholarships
- [ ] Manual data entry for initial scholarships

**Polish Tasks (Weeks 6-7):**
- [ ] Reference letter helper feature
- [ ] UI/UX improvements
- [ ] Test with own scholarship applications
- [ ] Deploy before scholarship season

---

## Future Tasks (Week 8+)

### Portfolio Enhancement
- [ ] SVG Animations (Full Stack + DevOps sections)
- [ ] Project Filters (tech stack, type, industry)
- [ ] Neural Network Particles Hero Animation

### Content & Credibility
- [ ] Blog posts for projects
- [ ] ML Sandbox (PyTorch/JupyterLab homework showcase)

### Marketing & Growth
- [ ] Marketing tool research (help mom + friends)
- [ ] Workout tracker (personal utility)
- [ ] Fitdays parser (if API exists)

---

## Status Badge System Notes

### Badge Design
```
┌─────────────────────┐
│   ●  LIVE  🚀       │  Green background, white text
└─────────────────────┘

┌─────────────────────┐
│   ●  LAUNCHED  📦   │  Blue background, white text
└─────────────────────┘

┌─────────────────────┐
│   ●  IN PROGRESS  🔧│  Yellow/Orange background, dark text
└─────────────────────┘

┌─────────────────────┐
│   ●  DEFUNCT  ⚰️    │  Gray background, white text
└─────────────────────┘

┌─────────────────────┐
│   ●  IoT  🔌        │  Purple background, white text
└─────────────────────┘
```

### Badge Placement
- Small badge in corner of project card (top-right or bottom-right)
- Subtle, doesn't interfere with click-to-open modal
- Hover shows full status text

### Project.json Schema Addition
```json
{
  "status": "live",  // Optional, auto-detected if missing
  "start": "2024-01",
  "end": {
    "present": true
    // or "date": "2024-06"
  },
  "link": "https://example.com",  // Live URL if available
  "sourceLink": "https://github.com/..."  // GitHub URL
}
```
