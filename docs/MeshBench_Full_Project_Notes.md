MeshBench Full Project Notes

Recommended new chat title

MeshBench is excellent:
- clear meaning
- technical/workbench vibe
- not tied to one vendor
- fits Thread + Matter diagnostics

MatterScope has baggage / naming conflicts.
Threadsmith evokes Threads social network.

Best way to start the new chat

We’re starting a project called MeshBench.

Goal: build a web GUI running on Ubuntu/Docker that combines chip-tool and ot-ctl into one dashboard for Matter + Thread.

Core features:
1. Commission Matter devices (Thread + Wi-Fi)
2. Show Thread mesh status (routers, children, neighbors, dataset)
3. Control commissioned Matter devices
4. Live logs
5. Designed for hobby lab use with OTBR and ESP-Matter devices

Phase 1: Define the machine

MeshBench = a local-first lab dashboard for Matter + Thread experimentation.
Built for people who want visibility, control, and zero nonsense.

Core Stack (v1)

Backend:
- Python FastAPI
- wrappers for chip-tool, ot-ctl, docker logs

Frontend:
- React + Tailwind

Runtime:
- Docker Compose on Ubuntu

v1 Screens

1. Bench Overview
2. Commission Device
3. Mesh Inspector
4. Device Console
5. Live Logs

v1 MVP Priority

1. Run ot-ctl state
2. Run ot-ctl router table
3. Run chip-tool pairing
4. Run chip-tool onoff on/off
5. Stream command output live

Recommended First Milestone

Can we control one bulb?

Build Philosophy

Think: oscilloscope for your mesh.

Windows-first workflow

Do 90% of project work on Windows.
Use Ubuntu only for live Matter/Thread testing.
