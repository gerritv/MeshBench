from fastapi import FastAPI
import subprocess

app = FastAPI(title="MeshBench")

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