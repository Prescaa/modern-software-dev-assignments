# Developer Control Center — FastAPI + React

A full-stack note management dashboard built with **FastAPI** (Python) on the backend and **Vite + React** on the frontend.

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm

## Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### Run the backend

```bash
uvicorn app.main:app --reload
```

The API will be available at **http://localhost:8000**.  
Interactive docs at **http://localhost:8000/docs**.

### Environment Variables (optional)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/app.db` | Path to the SQLite database file |

## Frontend Setup

```bash
cd frontend
npm install
```

### Run the frontend

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

## API Endpoints

### Notes
- `GET    /notes/`          — List notes (query params: `q`, `skip`, `limit`, `sort`)
- `POST   /notes/`          — Create a note
- `GET    /notes/{id}`      — Get a note
- `PUT    /notes/{id}`      — Update a note
- `PATCH  /notes/{id}`      — Partially update a note
- `DELETE /notes/{id}`      — Delete a note

### Categories
- `GET    /categories/`     — List categories
- `POST   /categories/`     — Create a category
- `GET    /categories/{id}` — Get a category
- `PUT    /categories/{id}` — Update a category
- `DELETE /categories/{id}` — Delete a category

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite, Pydantic
- **Frontend:** React 19, Vite, Axios
