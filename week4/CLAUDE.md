# Developer Command Center Guidelines

## Build and Test Commands
- Run Application: `python -m uvicorn backend.app.main:app --reload`
- Run Tests: `pytest`
- Code Formatting: `black .`
- Linting: `ruff check .`

## Project Structure
- Backend: FastAPI (located in `backend/app/main.py`)
- Database: SQLite (located in `data/`)
- Frontend: Static files (located in `frontend/`)

## Development Workflow
- Always use type hints for Python functions.
- Follow the TDD (Test-Driven Development) pattern.
- Ensure all code passes `ruff check .` before finishing a task.