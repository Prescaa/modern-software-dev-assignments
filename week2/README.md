## Week 2 – Action Item Extractor

This directory contains a small FastAPI + SQLite application that turns free‑form notes into structured action items.  
You interact with it via a minimal HTML frontend and a JSON API, and you can choose between a heuristic extractor and an LLM‑powered extractor (using Ollama).

### Project Structure

- `app/` – FastAPI application package
  - `main.py` – application entrypoint, API wiring, Pydantic schemas, and static file mounting
  - `db.py` – thin database layer around a SQLite file (`data/app.db`)
  - `routers/` – grouped API routers
    - `action_items.py` – endpoints for extracting and managing action items
    - `notes.py` – endpoints for creating and fetching individual notes
  - `services/extract.py` – heuristic and LLM‑based action‑item extraction logic
- `frontend/index.html` – static HTML/JS client used during local development
- `tests/` – pytest suite (currently focused on extraction logic)
- `assignment.md` / `writeup.md` – assignment specification and your write‑up template

---

## Environment and Setup

The project is managed with Poetry and assumes a Conda environment configured with Python 3.10+.

### 1. Create and activate a Conda environment

```bash
conda create -n cs146s python=3.10
conda activate cs146s
```

### 2. Install dependencies with Poetry

From the project root (where `pyproject.toml` lives):

```bash
poetry install
```

This will install:

- Runtime: `fastapi`, `uvicorn[standard]`, `pydantic`, `python-dotenv`, `ollama`, etc.
- Dev tooling: `pytest`, `httpx`, `black`, `ruff`, `pre-commit`, and more.

If you are new to Poetry, the key commands you will use are:

```bash
# Install dependencies (once)
poetry install

# Spawn a shell with the virtualenv active
poetry shell
```

> Tip: you can run all commands below either as `poetry run <command>` from the project root or from within a `poetry shell`.

---

## Running the Application

From the project root, start the FastAPI app with Uvicorn:

```bash
poetry run uvicorn week2.app.main:app --reload
```

Then open the frontend in a browser:

- Navigate to `http://127.0.0.1:8000/`
- Paste some notes into the textarea and click **Extract** (heuristic), **Extract LLM**, or **List Notes** once wired.

Static assets are served from `week2/frontend` under the `/static` path.

---

## API Overview

All endpoints are defined under the `week2.app` package. Below is a high‑level summary of the available routes.

### Root

- `GET /`
  - Returns the HTML frontend.

### Action Item Endpoints (`/action-items`)

- `POST /action-items/extract`
  - **Description**: Extracts action items from raw notes using heuristic rules.
  - **Request body** (JSON):
    - `text` (string, required): the raw note text.
    - `save_note` (bool, optional): if `true`, the raw note is persisted as a row in `notes`.
  - **Response** (JSON):
    - `note_id` (int or `null`): ID of the saved note if `save_note=true`.
    - `items` (array of objects):
      - `id` (int): database ID of the action item.
      - `text` (string): action item text.
  - **Status codes**:
    - `200 OK` on success.
    - `400 Bad Request` if `text` is empty.

- `GET /action-items`
  - **Description**: List all known action items, optionally filtered by `note_id`.
  - **Query parameters**:
    - `note_id` (int, optional): only return items for a specific note.
  - **Response** (JSON): array of objects:
    - `id`, `note_id`, `text`, `done` (bool), `created_at` (ISO‑like string).

- `POST /action-items/{action_item_id}/done`
  - **Description**: Mark an action item as done/undone.
  - **Request body** (JSON):
    - `done` (bool, optional, default `true`): desired completion state.
  - **Response** (JSON):
    - `id` (int): the action item ID.
    - `done` (bool): the updated state.

### Note Endpoints (`/notes`)

- `POST /notes`
  - **Description**: Create a new note row directly (without extraction).
  - **Request body** (JSON):
    - `content` (string, required): note text.
  - **Response** (JSON):
    - `id` (int), `content` (string), `created_at` (string).

- `GET /notes/{note_id}`
  - **Description**: Fetch a single note by its ID.
  - **Response** (JSON):
    - `id`, `content`, `created_at`.
  - **Status codes**:
    - `200 OK` on success.
    - `404 Not Found` if the note does not exist.

- `GET /notes`
  - **Description**: Retrieve all notes in reverse‑chronological order.
  - **Response** (JSON): array of objects:
    - `id`, `content`, `created_at`.

### LLM Extraction Endpoint

- `POST /extract-llm`
  - **Description**: Uses `extract_action_items_llm()` (Ollama‑backed) to extract action items from the provided text.
  - **Request body** (JSON):
    - `text` (string, required): raw note text to analyze.
  - **Response** (JSON):
    - `items` (array of strings): action items returned by the model after parsing.
  - **Status codes**:
    - `200 OK` on success.
    - `500 Internal Server Error` if something goes wrong at the LLM or parsing layer.

> Note: The LLM endpoint assumes you have Ollama installed with a compatible model (e.g., `tinyllama`) and that it is reachable from the server process.

---

## Database Layer

The application uses a local SQLite database located at `week2/data/app.db`. The helper functions in `app/db.py`:

- Ensure the `data/` directory exists.
- Create the `notes` and `action_items` tables if they do not already exist.
- Provide convenience functions like `insert_note`, `list_notes`, `get_note`, `insert_action_items`, `list_action_items`, and `mark_action_item_done`.

Connections are opened per operation via `get_connection()` and are wrapped in context managers so that commits and rollbacks are handled cleanly.

---

## Running the Test Suite

Tests are written with `pytest` and focus on the extraction logic (including the LLM‑based implementation, which is mocked so no real model calls are made).

From the project root:

```bash
conda activate cs146s
poetry run pytest -q
```

Or, if you are already inside a `poetry shell`:

```bash
pytest -q
```

You should see all tests in `week2/tests/` execute. As you add more tests for new features, they will be picked up automatically by `pytest`.

---

## Development Tips

- Use `uvicorn`’s `--reload` flag during development so that code changes are picked up automatically.
- Check the interactive API docs at:
  - `http://127.0.0.1:8000/docs` (Swagger UI)
  - `http://127.0.0.1:8000/redoc`
- Keep your `writeup.md` up to date with the prompts you use and the code regions that Cursor generated or modified.

