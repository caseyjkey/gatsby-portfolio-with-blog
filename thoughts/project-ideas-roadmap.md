# Project Ideas Roadmap

**Last Updated:** 2026-01-22
**Status:** Quick wins first → Scholarships Plus deep focus (18 essays available for RAG)

---

## Goals & Priorities

### Primary Goals (ranked by urgency)
1. **D - Help friends/family** - Marketing tools, Spirit Beads promotion
2. **C - Strengthen portfolio** - Become more marketable overall
3. **B - Build consumer ML app** - Revenue potential, credibility in space
4. **A - FAANG ML engineer** - Long-term career goal

### Working Style
- Sequential work with occasional parallel tasks
- Flexible timeline, but prefer steady progress
- Build tools rather than pay for services (cost-conscious)

---

## Idea Catalog

### ML CREDIBILITY IDEAS

#### 1. ML Sandbox - Project Showcase Platform
**Summary:** Parse through all deep learning projects/homework assignments, organize by functionality (not "hw6" labels), make viewable in browser (Python-in-browser or convert to TypeScript), host in single location.

**Features:**
- Upload ML assignments/projects to be viewable by others via their profile
- Public platform for sharing with AI classmates
- Link from Skills.tsx Machine Learning Engineer section
- Provides verifiable proof of ML skills (currently self-reported on resume)

**Source Material:**
- 10-20 deep learning homework assignments
- Frameworks: PyTorch, JupyterLab
- All Python-based (uncertain about scikit-learn, TensorFlow usage)

**Technical Considerations:**
- Browser-based Python execution (Pyodide, Brython) or TypeScript conversion
- User profiles and project uploads
- Social/sharing features for classmates
- Jupyter notebook rendering in browser

**Dependencies:** Need to inventory and organize homework assignments first

**Effort:** Large (multi-week project)

**Impact:** High - directly addresses lack of verifiable ML credentials

---

#### 4. Neural Network Particles Hero Animation
**Summary:** Add particles.js to hero section, configure as neural network or Bayesian network showing propagation/backpropagation.

**Visual Effect:** Nodes and edges that animate forward (propagation) and backward (backpropagation)

**Strategic Value:**
- Makes portfolio uniquely yours (less template-y)
- Signals ML focus to visitors
- Gimmicky but memorable

**Technical Considerations:**
- Neural network: discrete on/off states, clearer animation
- Bayesian network: continuous probabilities, more subtle

**Dependencies:** None

**Effort:** Medium

**Impact:** Medium - visual differentiation, ML signaling

---

#### 10. Financial Dashboard with Agent-Based Aggregation
**Summary:** Unified dashboard for all financial accounts using agents to fetch and analyze statements.

**Accounts to Integrate:**
- 401k, E*Trade, Ally Savings, Capital One (checking/credit card)
- Schwab (checking, Roth IRA, traditional IRA, brokerage)
- Best Buy credit card, Coinbase (debit card, account)
- Robinhood, Stripe

**Features:**
- Agent-based statement compilation from all sources
- Spending/deposit analysis
- Progress bars for financial goals

**Technical Considerations:**
- API access vs. scraping for each institution
- Security credentials handling
- Data normalization across institutions

**Dependencies:** Agent infrastructure (related to Clawdbot #11)

**Effort:** Large

**Impact:** Personal utility first, potential product later

---

### PORTFOLIO POLISH IDEAS

#### 2. SVG Animations for Section Illustrations
**Summary:** Animate remaining section SVGs (currently only SittingSvg is animated with subtle float).

**Proposed Animations:**
- **Full Stack Engineering:** Website illustration - page elements scroll or fade in/out
- **DevOps:** Boxes connected by lines, line animates between boxes, each box turns green or shows checkmark

**Current State:**
- SittingSvg: Animated (subtle up/down float) ✓
- Full Stack SVG: Static
- DevOps SVG: Static

**Dependencies:** None

**Effort:** Small-Medium

**Impact:** Medium - visual polish, engagement

---

#### 3. Project Filters on Projects Page
**Summary:** Add filtering capability to projects page (currently ~10 projects across 4 rows, 2-3 more to add).

**Styling Challenge:** Maintain "professional tech engineer / future approachable tech CEO" persona

**Current Projects:** ~10 displayed, need to add:
- Spirit Beads (complete, deployed)
- Githubly
- Potentially 1 more

**Dependencies:** Need to finalize project list first (#7)

**Effort:** Medium

**Impact:** Medium-High - usability, can showcase breadth

---

#### 5. Convert Logo to SVG
**Summary:** Convert existing logo to SVG format for higher resolution, browser consistency, and visual improvements.

**Enhancements:**
- Cutout effect
- Single-color "Casey" text

**Benefits:**
- Higher resolution at all sizes
- Consistent across browsers
- Cleaner, more modern look
- Slightly smaller file size

**Dependencies:** None

**Effort:** Small

**Impact:** Low-Medium - polish, consistency

---

#### 6. Fix Header/Resume Accordion Scroll Bug
**Summary:** Fix interaction between smart header and Resume page accordion scrolling.

**Bug Description:**
- Accordion scroll sometimes leaves blank space above section
- Header doesn't always drop into view when expected
- Creates unpolished user experience

**Strategic Value:**
- Portfolio should feel "perfect and bug-tested"
- Demonstrates QA/DevOps specialization claimed in resume

**Dependencies:** None

**Effort:** Small

**Impact:** Medium - bug-free perception, quality signal

---

#### 7. Add Spirit Beads and Githubly to Portfolio
**Summary:** Add two new projects to portfolio with proper descriptions.

**Spirit Beads:**
- Purpose: E-shop for beaded lighter cases (mom's business)
- Status: Perfect, deployed to domain, ready for orders
- Tech: Uses architecture learned at Oracle and Salesforce
- URL: [to be added]
- **Can add immediately** ✓

**Githubly:**
- Purpose: Software developer brand management tool
- Tagline: "Optimize your GitHub presence for SEO and impact"

**Features:**
1. **Contribution Graph Flood Fill**
   - Populate graph with random values (looks like active OSS contributor)
   - Custom patterns/text on contribution graph
   - Status: Mostly complete

2. **Repo Organizer (LLM-powered)**
   - Analyze repos using LLM
   - Group into monorepos
   - Suggest which to private/archive (brand alignment)
   - Generate SEO-optimized READMEs, titles, descriptions, topics
   - Status: In development

3. **Profile README Generator**
   - Beautiful, descriptive, impressive profile READMEs
   - Status: Planned

4. **GitHub Repo Populator**
   - Search for repos and add to profile with custom names
   - Helps new users get repos for repo organizer
   - Status: Planned

**Business Model:** Monthly Pro subscription (unlocks all features)

**Tech Stack:** Next.js, TypeScript, Prisma + Postgres, Docker, pm2, bun, bash scripts + Z.ai LLM APIs

**Timeline to Complete:** ~2 weeks

**Status:** Only contribution graph is mostly complete; other features in development
- **Can add to portfolio as "In Development" or wait until complete**

**Dependencies:** None (just data entry + potentially #3 for filters)

**Effort:** Small for Spirit Beads; Githubly depends on completion status

**Impact:** High - Spirit Beads adds deployed, customer-facing project; Githubly showcases full-stack + SaaS skills

---

#### 8. Add Blog Posts + GitHub URLs to Projects
**Summary:** Write blog posts for all projects, add GitHub URLs as buttons in project cards.

**Scope:**
- Write blog post for each project
- Add GitHub repository buttons to project cards
- Demonstrates thought leadership and technical depth

**Dependencies:** #7 (need projects finalized first)

**Effort:** Medium-Large (writing intensive)

**Impact:** High - thought leadership, SEO, project depth

---

#### 9. Blog Post Image Generation Pipeline
**Summary:** Automated pipeline that parses blog posts and uses LORA/crafted prompts with text-to-image models to generate consistent images.

**Features:**
- Parse blog post content
- Generate contextually appropriate images
- Maintain visual consistency across posts
- LORA fine-tuning or prompt engineering for style

**Technical Considerations:**
- Text-to-image model selection (Stable Diffusion, DALL-E, etc.)
- LORA training for consistent style
- Prompt generation from post content
- Automation pipeline

**Dependencies:** #8 (need blog posts first)

**Effort:** Large

**Impact:** Medium - visual polish, automation showcase

---

#### 12. Bookmark Organization Tool
**Summary:** Unify Facebook/Instagram/X bookmarks and browser bookmarks into one searchable, organized location.

**Features:**
- Aggregate bookmarks from multiple platforms
- Search functionality
- Organization system (tags, folders, etc.)

**Motivation:** Personal productivity tool

**Dependencies:** None

**Effort:** Medium

**Impact:** Personal utility first, potential product later

---

### PERSONAL PRODUCTIVITY & HEALTH IDEAS

#### 13. Google Sheet Workout Tracker & Analyzer
**Summary:** Parse Google Sheet workout data, create visualizations and insights while maintaining current workflow.

**Current Workflow:**
- Track workouts in Google Sheets
- Create a new page for each week

**Desired Features:**
- Parse existing workout data
- Charts/graphs showing progress trends
- Workout suggestions based on patterns
- Maintain current workflow (no disruption)

**Potential Evolution:**
- Mobile app that mirrors current workflow
- Add graphs and workout page suggestions on top

**Strategic Value:**
- Learn about personal fitness trends
- Practice data visualization
- Potential mobile app development experience

**Dependencies:** Access to workout Google Sheet

**Effort:** Medium (Sheet script/charts) to Large (mobile app)

**Impact:** Personal utility first, potential product for fitness community

---

#### 14. Fitdays Data Parser for LLM Analysis
**Summary:** Parse Fitdays health/fitness data to feed into LLMs for personalized suggestions.

**Features:**
- Extract data from Fitdays app
- Prepare data for LLM consumption
- Get AI-powered fitness/health suggestions

**Technical Challenges:**
- Check if Fitdays has public API
- If no API: reverse engineer their app
- Data format normalization
- Privacy/security considerations

**Strategic Value:**
- Personalized fitness insights
- Practice API integration/reverse engineering
- Potential product for fitness data analytics

**Dependencies:** Fitdays API access or reverse engineering

**Effort:** Medium (if API exists) to Large (if reverse engineering needed)

**Impact:** Personal utility first, potential product

---

### EDUCATION & COMMUNITY IDEAS

#### 15. Scholarships Plus - RAG-Powered Scholarship Assistant ⏰
**Summary:** RAG-powered app that uses previous scholarship essays to help write new ones, tracks Native American scholarship opportunities, and helps with reference letters.

**Features:**
1. **Essay Writing Assistant (RAG)**
   - Uses previous scholarship essays/submissions as context
   - Helps write this year's scholarship essays
   - Maintains personal voice while improving quality

2. **Scholarship Tracker**
   - Native American scholarship opportunities
   - Deadlines, requirements tracking
   - Application status management

3. **Reference Letter Helper**
   - Similar to essay helper - guides recommenders
   - Templates and suggestions for strong references

**Tech Stack:**
- Remix (web framework)
- PostgreSQL (database)
- LLM + Langchain (RAG pipeline)
- Pinecone (vector embeddings)

**Timeline:** **URGENT** - Need before March, ideally before April (scholarship season)

**Status:** Very early stage

**Strategic Value:**
- Personal benefit: Help with own scholarship applications
- Community benefit: Help Native American students find opportunities
- Portfolio: Showcase RAG/ML skills
- Social impact: Increase access to education funding

**Challenge:** Marketing once built (similar to other projects)

**Dependencies:**
- **Previous essays for RAG training:** 6+ years × 3+ per year = 18+ essays ✓
- **Scholarship data sources:**
  - Email lists (subscriptions to scholarship newsletters)
  - Memory (personally known scholarships)
  - Scholarship websites with Native American listings

**Effort:** Large

**Impact:** **High** - Personal + community impact + portfolio (RAG/ML credibility)

**⚠️ Time Sensitivity:** Scholarship season is March-April. This project needs prioritization!

---

### MARKETING/AUTOMATION IDEAS

#### 10. LLM-Powered Community Marketing Tool
**Summary:** Create or research application that uses LLMs to post in local Facebook communities and niche Reddit/other communities to advertise products/services.

**Use Cases:**
- Help skilled laborer friends (plumbing, construction, HVAC, concrete)
- Advertise web apps (Spirit Beads, Githubly)
- Create Google/Facebook ads for non-tech-savvy friends

**Strategic Value:**
- Help friends get more work and make money
- Drive traffic/validation to own projects
- Low-cost marketing (build vs. buy services)

**Research Needed:**
- Does this already exist? (existing tools vs. build decision)
- Platform API access (Facebook, Reddit)
- Content generation quality/relevance
- Compliance with platform terms of service

**Dependencies:** Research phase needed

**Effort:** Unknown (depends on research findings)

**Impact:** High - directly helps friends, promotes own projects, potential product

---

### AGENT/INFRASTRUCTURE IDEAS

#### 11. Clawdbot Professional Personas Group Chat
**Summary:** Set up Clawdbot as group chat of professional personas for advice and project kickoff assistance.

**Persona Types:**
- Teachers for various topics
- Project-specific agents (expert in each of your projects)
- Idea development assistance

**Use Cases:**
- Learning new topics
- Getting other agents started on ideas
- Project brainstorming

**Dependencies:** Clawdbot infrastructure

**Effort:** Medium

**Impact:** Medium - productivity, learning acceleration

---

## Prioritization Framework

### By Goal Alignment

| Idea | Helps Friends/Family | Portfolio Marketability | ML Credibility | Revenue Potential | Time Sensitivity |
|------|---------------------|------------------------|----------------|-------------------|------------------|
| 1. ML Sandbox | - | ✓ | ✓✓✓ | Potential | - |
| 2. SVG Animations | - | ✓ | - | - | - |
| 3. Project Filters | - | ✓ | - | - | - |
| 4. Neural Particles | - | ✓ | ✓ | - | - |
| 5. Logo SVG | - | ✓ | - | - | - |
| 6. Header Bug Fix | - | ✓ | - | - | - |
| 7. Add Projects | ✓ (mom) | ✓✓ | ✓ | ✓ (Spirit Beads) | - |
| 8. Blog Posts | - | ✓✓ | ✓ | - | - |
| 9. Image Pipeline | - | ✓ | - | - | - |
| 10. Marketing Tool | ✓✓✓ | ✓ | - | ✓✓ | - |
| 10. Finance Dashboard | - | ✓ | - | ✓ (personal) | - |
| 11. Clawdbot | - | - | - | - | - |
| 12. Bookmarks | - | - | - | Potential | - |
| 13. Workout Tracker | - | ✓ | - | Potential | - |
| 14. Fitdays Parser | - | - | - | Potential | - |
| 15. Scholarships Plus | ✓✓ (community) | ✓✓ | ✓✓ (RAG) | Potential | ⏰ **URGENT** |

### By Effort vs. Impact Matrix

```
HIGH IMPACT
    │
    │  • 15. Scholarships Plus (Large effort) ⏰ URGENT
    │  • 1. ML Sandbox (Large effort)
    │  • 10. Marketing Tool (Unknown effort)
    │  • 7. Add Projects (Small effort) ⭐
    │
MEDIUM│  • 3. Project Filters (Medium)
IMPACT│  • 4. Neural Particles (Medium)
    │  • 8. Blog Posts (Medium-Large)
    │  • 13. Workout Tracker (Medium-Large)
    │  • 14. Fitdays Parser (Medium-Large)
    │  • 2. SVG Animations (Small-Med) ⭐
    │  • 6. Header Bug (Small) ⭐
    │
    │  • 5. Logo SVG (Small)
    │  • 9. Image Pipeline (Large)
    │  • 10. Finance Dashboard (Large)
    │  • 11. Clawdbot (Medium)
    │  • 12. Bookmarks (Medium)
    LOW
    └─────────────────────────────
     LOW EFFORT        HIGH EFFORT

⭐ = Quick wins
⏰ = Time-sensitive (hard deadline)
```

### ⚠️ CRITICAL: Scholarships Plus Priority

**Scholarships Plus (#15) is now your #1 priority due to:**
- **Hard deadline:** Must be ready before March/April for scholarship season
- **Triple alignment:** Helps community (Native American students) + portfolio (RAG/ML) + personal (scholarship applications)
- **ML credibility:** Demonstrates RAG skills directly relevant to ML Full Stack goal

**Current date:** January 22, 2026
**Time remaining:** ~6-10 weeks until scholarship season

**Recommended action:** Start Scholarships Plus immediately, do quick portfolio wins in parallel

---

## Recommended Sequencing

### Phase 1: Portfolio Quick Wins First (Week 1) ⚡
**Focus:** Quick portfolio polish, then fully focus on Scholarships Plus

**Quick Wins (do these first to clear mental space):**

1. **#7a - Add Spirit Beads** (Small effort, high impact)
   - Gets mom's store visible immediately
   - Adds deployed, customer-facing e-commerce project

2. **#6 - Fix header/accordion bug** (Small effort, medium impact)
   - Quality signal (QA/DevOps credibility)
   - Shows attention to detail

3. **#5 - Convert logo to SVG** (Small effort, low-medium impact)
   - Quick polish
   - Consistent branding

4. **#7b - Add Githubly** (Small effort, medium impact)
   - **Recommendation:** Add as "In Development - Launching February 2025"
   - Shows SaaS ambitions + LLM integration
   - Update when complete (~2 weeks)

**Time estimate:** 1 week for all quick wins

---

### ⏰ Phase 2: Scholarships Plus Deep Focus (Weeks 2-7)
**Focus:** Time-critical project for scholarship season (deadline: March/April)
**Current date:** January 22, 2026 | **Time remaining:** ~6-10 weeks

**PRIMARY TRACK: #15 - Scholarships Plus** (Large effort, high impact)

**Minimum Viable Product (MVP) - Weeks 2-5:**
1. Essay Writing Assistant (RAG)
   - Set up Remix + PostgreSQL
   - Implement Langchain RAG pipeline
   - Pinecone vector embeddings
   - **18+ essays available for training data** ✓

2. Scholarship Tracker
   - Native American scholarship database
   - Basic CRUD for deadlines/requirements
   - **Data sources: Email lists, memory, scholarship websites** ✓

**Polish Phase - Weeks 6-7:**
3. Reference Letter Helper
4. UI/UX improvements
5. Testing with own scholarship applications

---

### Phase 3: Portfolio Enhancement (Weeks 8-9)
**Focus:** Make portfolio uniquely yours + ML signaling (after Scholarships Plus MVP is usable)

1. **#2 - SVG Animations** (Full Stack + DevOps)
2. **#3 - Project Filters** (now have Spirit Beads + Githubly)
3. **#4 - Neural Particles Hero** (ML signaling)

---

### Phase 4: Content & Credibility (Weeks 10+)
**Focus:** Deepen portfolio content and establish ML credibility

1. **#8 - Blog Posts for Projects** (thought leadership)
2. **#1 - ML Sandbox** (ML credibility)
3. **#10 - Marketing Tool Research** (help mom's store + friends)

---

### Phase 5: Personal Tools (Ongoing)
**Focus:** Personal utility when time permits

1. **#13 - Workout Tracker**
2. **#14 - Fitdays Parser**
3. **#9 - Blog Image Pipeline**
4. **#10 - Finance Dashboard**
5. **#11 - Clawdbot Setup**
6. **#12 - Bookmark Tool**

---

## Timeline Summary

| Week(s) | Primary Focus | Notes |
|---------|--------------|-------|
| 1 | Portfolio quick wins (Spirit Beads, bug fix, logo, Githubly) | Clear mental space for Scholarships Plus |
| 2-7 | Scholarships Plus (MVP + polish) | 18 essays for RAG, multiple data sources |
| 8-9 | Portfolio enhancement (SVG animations, filters, neural hero) | After Scholarships Plus is usable |
| 10+ | ML Sandbox, blog posts, marketing research | Credibility building |

**Key Milestones:**
- Week 1: Portfolio polished, mom's store visible
- Week 5: Scholarships Plus MVP ready for own applications
- Week 7: Scholarships Plus fully polished
- March-April: Scholarship season - app is ready!

---

## Decision Points

### ⏰ URGENT: Scholarships Plus Decisions Needed

1. **Scholarships Plus (#15):** Start immediately or delay?
   - **Recommendation:** START IMMEDIATELY - Hard deadline March/April
   - Parallel: Do 1-2 hours/week of portfolio quick wins

2. **Scholarships Plus MVP Scope:** What's the minimum you need?
   - Essay RAG assistant only?
   - + Scholarship tracker (manual data entry)?
   - + Reference letter helper?
   - Recommendation: MVP = Essay RAG + Basic tracker

3. **Scholarships data sources:** Where will you get Native American scholarship listings?
   - Manual research/entry?
   - Web scraping?
   - Existing APIs/databases?

### Other Decisions (Can Wait Until After Phase 0)

4. **Marketing Tool (#10):** Research first or build immediately?
   - Recommendation: 1-week research sprint to validate if build is needed

5. **ML Sandbox (#1):** Python-in-browser (Pyodide, Brython) or TypeScript conversion?
   - Pyodide: More authentic, slower
   - TypeScript: Faster, more work, better portfolio showcase
   - Recommendation: Mixed approach based on project complexity

6. **Project Filters (#3):** What filter categories?
   - Tech stack (React, Python, etc.)
   - Project type (Web, ML, DevOps, etc.)
   - Industry (E-commerce, Developer Tools, etc.)

---

### Questions for User

**Answered:**
- ✅ Githubly details: Full breakdown above - SaaS for GitHub brand optimization with 4 features
- ✅ ML projects: 10-20 assignments, PyTorch + JupyterLab, all Python
- ✅ Timeline: Scholarships Plus has hard deadline (March/April)
- ✅ Scholarships data: Email lists, memory, scholarship websites
- ✅ Previous essays: 6+ years, 3+ per year = 18+ essays for RAG training
- ✅ Approach: Quick portfolio wins first, then lock in on Scholarships Plus

**Remaining:**

1. **Blog posts:** Do you have existing content to adapt, or starting from scratch?

2. **Githubly portfolio decision:** Add now as "In Development" or wait until complete (~2 weeks)?

---

## Next Steps

### Quick Wins First Path ✅ (Your Choice - Recommended!)

**Week 1: Portfolio Quick Wins** (clear mental space for Scholarships Plus focus)

1. **Add Spirit Beads to portfolio** (#7a)
   - Immediate help for mom's store
   - Quick data entry

2. **Fix header/accordion bug** (#6)
   - Quality signal
   - Quick bug fix

3. **Convert logo to SVG** (#5)
   - Quick polish
   - Brand consistency

4. **Add Githubly to portfolio** (#7b)
   - Add as "In Development - Launching February 2025"
   - Shows SaaS ambitions

**Then: Deep focus on Scholarships Plus with clear mind**

---

### Immediate Action: Start with Spirit Beads?

Ready to add Spirit Beads to your portfolio? I can help you:
1. Create the project entry with proper description
2. Add to your projects data file
3. Style the project card

---

*This document is a living roadmap. Updated 2026-01-22 with Scholarships Plus as #1 priority due to hard deadline.*
