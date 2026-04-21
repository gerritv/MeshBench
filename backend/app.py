from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI(title="MeshBench")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "MeshBench is alive"}

@app.get("/api/health")
def health():
    return {"status": "ok", "project": "MeshBench"}

@app.get("/api/thread/state")
def thread_state():
    try:
        result = subprocess.run(
            ["docker", "exec", "otbr", "ot-ctl", "state"],
            capture_output=True,
            text=True,
            timeout=5
        )

        raw = result.stdout.strip().splitlines()
        lines = [line for line in raw if line.strip() != "Done"]

        return {
            "status": "ok",
            "state": lines[0] if lines else "unknown"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/api/thread/router-table")
def router_table():
    try:
        result = subprocess.run(
            ["docker", "exec", "otbr", "ot-ctl", "router", "table"],
            capture_output=True,
            text=True,
            timeout=5
        )

        lines = [
            line.strip()
            for line in result.stdout.splitlines()
            if line.strip() and line.strip() != "Done"
        ]

        return {
            "status": "ok",
            "rows": lines
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.post("/api/command")
def run_command(cmd: str):
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=10
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "code": result.returncode
        }
    except Exception as e:
        return {"error": str(e)}