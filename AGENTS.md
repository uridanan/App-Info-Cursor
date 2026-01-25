# Project: App-Info-Cursor - Core Knowledge Base

## 1. Technical Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: TypeScript
- **Database**: [e.g., PostgreSQL / Supabase]
- **State Management**: [e.g., React Context / Zustand]

## 2. Architectural Vision (OOP)
All agents must adhere to the following architectural patterns:
- **Service Layer Pattern**: Business logic resides in Classes inside `backend/services/`.
- **Repository Pattern**: Data access is abstracted via interfaces/classes in `backend/db/`.
- **Dependency Injection**: Use FastAPI's `Depends` to inject service classes into endpoints.
- **DTOs**: Use Pydantic models for all request/response validation.

## 3. Directory Structure
- `/frontend`: React application.
- `/backend`: FastAPI application.
  - `/api`: Route handlers.
  - `/services`: OOP Business logic (The Implementer's main playground).
  - `/models`: Pydantic/Database models.
- `/tests`: Shared test directory for both stacks.

## 4. Common Patterns & Guardrails
- **Naming**: Use `CamelCase` for React components and `snake_case` for Python methods.
- **Error Handling**: Use a global Exception Handler in FastAPI; never return raw error strings.
- **Auth**: [e.g., JWT-based auth via 'Authorization: Bearer' header].

## 5. Agent Pipeline Integration
This project uses the 5-Agent Pipeline (`.cursor/rules/`).
- **Architect (Agent 1)** should prioritize defining `abc.ABC` classes in Python.
- **Tester (Agent 2)** uses `pytest` for the backend and `Vitest` for the frontend.
- **Implementer (Agent 3)** must check `/backend/services/` for existing class patterns to ensure consistency.