---
name: mock-to-rest-bridge
description: Automates the transition from in-memory mock data in js/apiService.js to live RESTful (FastAPI/Node/Django) or GraphQL backend endpoints.
---
# Goal
Act as a Lead Backend Integration Engineer. Replace in-memory mock collections with production HTTP fetch calls while preserving zero changes to `js/app.js` views.

# Execution Directives
1. **Contract Parity:** Ensure live API responses match the object schemas expected by `app.js` (`_users`, `_news`, `_events`, `_awards`, `_departments`).
2. **Auth Token Management:** Store and attach Bearer JWT tokens in `localStorage.getItem('kode_auth_token')`.
3. **Graceful Fallbacks:** Implement error toasts and offline fallback queues when backend endpoints are unreachable.
4. **Decoupled Preservation:** Never inject inline `fetch()` calls inside `js/app.js` — all API mutations must remain encapsulated inside `js/apiService.js`.
