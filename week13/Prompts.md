# Sprint 13 Planning - My Decision Process

## Overview
This doc shows how I planned TaskMatrix architecture. I used AI to compare options and validate decisions, but all final choices were mine based on project needs.

---

## 1. Feature Scope

**Problem**: Too many features for 5 weeks

**Question**: How to prioritize without building half-done features?

**Decision**:
- **Sprint 14**: Auth + basic project/task CRUD (get something working)
- **Sprint 15**: Kanban drag-drop + collaboration
- **Sprint 16**: Real-time + analytics  
- **Later**: Automation, integrations

Why: Ship early, iterate. Don't build everything at once.

---

## 2. Tech Stack

### Frontend: Next.js 14
**Why**:
- API routes = frontend + backend in one codebase
- SSR for SEO
- Vercel deploy is easy
- TypeScript built-in

Considered React+Vite but Next.js simpler for deployment.

### State: Zustand + React Query
**Why**:
- React Query = server data + caching
- Zustand = UI state (sidebar, modals)
- Less boilerplate than Redux

### Database: MongoDB (5 collections)
**Collections**:
1. users
2. projects
3. tasks
4. comments  
5. activities

**Why separate comments**: Tasks can have 100+ comments, embedding would bloat task docs

**Why 5 collections**: ProDesk guideline is 3-5, this fits scope

---

## 3. Real-time

**Need**: Multiple users see board updates instantly

**Choice**: Socket.io

**Why**:
- Auto-reconnect (don't have to build it)
- Rooms = one per project board
- Easier than raw WebSocket API

**Events**: task_created, task_updated, task_moved, comment_added

---

## 4. Security

**JWT tokens**: httpOnly cookies (safer than localStorage for XSS)

**Token life**: 
- Access: 15 min
- Refresh: 7 days

**Passwords**: bcrypt, 12 rounds

**Validation**: Zod schemas on all inputs

---

## 5. Database Schema Decisions

**Embed vs Reference**:
- Embed: subtasks (small, bounded)
- Reference: comments (can grow), projects, users

**Kanban ordering**: position field (integer) in tasks

**Sprints**: String field in tasks for MVP (simpler than separate collection)

**Indexes**: Compound (project + status) for fast board queries

---

## 6. API Design

**Structure**:
- Nested for creation: `POST /api/projects/:id/tasks`
- Flat for updates: `PUT /api/tasks/:id`
- Query params for filters: `GET /api/tasks?status=todo`

**Why**: Nested shows relationship on create, flat is simpler for updates

---

## 7. UI Components

**Drag-drop**: @dnd-kit
- Modern, maintained
- Built-in keyboard accessibility
- Touch-friendly for mobile

**Styling**: Tailwind + Shadcn UI
- Fast development
- Consistent design
- Pre-built accessible components

---

## Key Takeaways

**My decisions**:
- Next.js (SSR + API routes)
- Zustand + React Query (simple state)
- MongoDB 5 collections
- Socket.io (real-time)
- JWT httpOnly cookies

**Why these work**:
Each choice solved a specific problem:
- Next.js = unified deployment
- 5 collections = meets ProDesk guideline, simple MVP
- Socket.io = don't reinvent reconnection
- httpOnly cookies = XSS protection

**How I used AI**:
- Asked questions to compare options
- Validated technical decisions
- Learned trade-offs (e.g., localStorage vs cookies)
- But I made final calls based on my timeline and requirements

---

## Next Steps (Sprint 14)

1. Initialize Next.js + TypeScript project
2. Set up MongoDB Atlas database
3. Configure Tailwind + Shadcn UI
4. Implement authentication (register, login, JWT)
5. Create database schemas with Mongoose
6. Build basic project and task CRUD APIs
7. Deploy MVP to Vercel (staging environment)

---

**Author**: Rakesh Kumar  
**Date**: August 11, 2026  
**Purpose**: ProDesk Sprint 13 - Architectural Planning
