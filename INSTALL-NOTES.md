## Fresh Ubuntu Install

## Packages Needed

## Python Setup

## Node Setup

## Docker Permissions

## First Run

## Known Gotchas
- Ubuntu blocks global pip installs; use venv
- Use python -m uvicorn to avoid wrong binary
- Frontend requires Vite restart after .env edits
- FastAPI needs CORS for separate frontend port
- docker logs may emit stderr, not stdout

## Running MeshBench

MeshBench Quick Start

Backend (Ubuntu server)
----------------------
cd ~/MeshBench/
source .venv/bin/activate
cd backend/
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

Frontend (second terminal)
--------------------------
cd ~/MeshBench/frontend
npm run dev -- --host

Open Browser
------------
http://<server-ip>:5173

Example:
http://192.168.1.71:5173

Notes
-----
- Backend API runs on port 8000
- Frontend runs on port 5173
- Ensure backend .env and frontend .env are set
- Vite auto reloads frontend changes
- Uvicorn auto reloads backend changes