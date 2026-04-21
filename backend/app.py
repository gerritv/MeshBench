from fastapi import FastAPI
import subprocess

app = FastAPI(title="MeshBench")

@app.get("/api/health")
def health():
    return {"status": "ok", "project": "MeshBench"}

@app.get("/api/thread/state")
def thread_state():
    # mocked for now
    return {"state": "leader"}

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