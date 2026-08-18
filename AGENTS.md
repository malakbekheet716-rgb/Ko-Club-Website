# AGENTS.md — Team & Multi-Agent Collaboration Governance

> **MANDATORY INSTRUCTION FOR ALL AI CODING ASSISTANTS** (Google Antigravity, Claude Code, Cursor, Windsurf, Copilot, ChatGPT, etc.)  
> This project is continuously synced via Google Drive and developed collaboratively by multiple team members and AI tools. To prevent knowledge drift, regressions, and sync conflicts, **every AI agent MUST strictly adhere to the rules below.**

---

## 🚨 RULE 1: Mandatory Continuous Project Memory Sync (`PROJECT_MEMORY.md`)

1. **Pre-Task Memory Inspection (READ FIRST):**
   - At the beginning of EVERY conversation or task, you **MUST** read [`.agents/PROJECT_MEMORY.md`](file:///e:/malak/KODE_Sports_Club_Employee_Hub_EDITABLE_Optional_Buddy/.agents/PROJECT_MEMORY.md) (or `PROJECT_MEMORY.md` in the project root).
   - Never assume file structures, user rosters, or API designs without reading `PROJECT_MEMORY.md`.

2. **Post-Implementation Memory Update (UPDATE IMMEDIATELY):**
   - After completing **ANY** code change, new feature, bug fix, or refactor, you **MUST** update [`.agents/PROJECT_MEMORY.md`](file:///e:/malak/KODE_Sports_Club_Employee_Hub_EDITABLE_Optional_Buddy/.agents/PROJECT_MEMORY.md) before concluding your turn.
   - Specifically update:
     - **Feature Catalog:** Document new UI screens, components, or logic blocks.
     - **Decisions & Learnings Log:** Add a dated entry explaining what was changed and why.
     - **User Directory:** Update `_users` roster if any accounts were added/modified.
     - **API Integration Table:** Document any new endpoints or parameters added to `js/apiService.js`.

3. **Drive Sync & Non-Destructive Edits:**
   - Always preserve existing documentation, notes, and architectural diagrams.
   - Do not wipe or truncate `PROJECT_MEMORY.md` — append and update sections systematically.

---

## 🏛️ RULE 2: Architecture & Code Separation Protocol

1. **Decoupled API Service Layer (`js/apiService.js`):**
   - **NEVER** write inline `fetch()`, direct backend calls, or unabstracted state mutations inside `js/app.js` or view templates.
   - **ALL** data operations (Auth, Users, News, Events, Awards, Comments, Departments) **MUST** be defined as async methods inside `js/apiService.js`.
   - Views in `js/app.js` must only call `await window.apiService.methodName()`. This allows the team to swap mock data for real backend APIs instantly without touching UI code.

2. **Pure Vanilla CSS & Theme Integrity (`css/styles.css`):**
   - **DO NOT** inject heavy CSS frameworks (Tailwind, Bootstrap, etc.) that introduce stylesheet conflicts or break existing custom properties.
   - Every new UI element **MUST** support both **Light Mode** and **Dark Mode** (`body.dark`).
   - Maintain the Stitch Glassmorphism design system (`.glass-panel`, `.glow-text`, `.feed-action-btn`).

3. **Preserve Native Swipe & Animation Systems:**
   - Touch and mouse swipe gestures in `bindFeedSwipe()` rely on `#feedCard` and `.feed-card`. Do not remove or alter container IDs required for gesture animations.

---

## 🔐 RULE 3: Passwordless SSO & Access Control

1. **Passwordless Flow:** All authentication must validate against registered employees in `apiService.js` (`_users` or target `/api/users` endpoint).
2. **Role Boundaries:**
   - `Admin` & `HR`: Full access to the HR Admin Panel and Employee CRUD.
   - `Manager`: Access to peer recognition award portal and department hierarchies.
   - `Employee`: Standard department workspace and social feeds.
3. **Session Persistence:** Keep `localStorage.getItem('kode_session_user_id')` synchronized with the active session.

---

## 📋 Quick Task Checklist for Every Agent

- [ ] 1. Read `.agents/PROJECT_MEMORY.md` before writing code.
- [ ] 2. Implement features following the decoupled `apiService.js` &harr; `app.js` pattern.
- [ ] 3. Verify Light Mode and Dark Mode rendering.
- [ ] 4. Verify that touch/mouse swipe and action buttons work.
- [ ] 5. **Update `.agents/PROJECT_MEMORY.md`** with the latest changes and release notes.
