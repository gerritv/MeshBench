
MeshBench Master Notes

Recommended new chat title
MeshBench is excellent: clear meaning, technical/workbench vibe, not tied to one vendor, fits Thread + Matter diagnostics.
MatterScope has baggage. Threadsmith too related to Threads social network.

New chat kickoff prompt
We’re launching MeshBench.
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
- subprocess wrappers for chip-tool, ot-ctl, docker logs

Frontend:
- React + Tailwind
- Dark bench instrument aesthetic

Runtime:
- Docker Compose on Ubuntu

v1 Screens
1. Bench Overview: OTBR status, border router role, active dataset name, router count, child count, commissioner availability
2. Commission Device: QR/manual code, Thread pairing, Wi-Fi pairing, open commissioning window
3. Mesh Inspector: router table, child table, neighbor table, ping tool
4. Device Console: Matter nodes, On/Off, Read attributes, Identify, Endpoint explorer
5. Live Logs: OTBR, chip-tool, MeshBench backend

Directory Layout
meshbench/
 backend/
 frontend/
 docker-compose.yml
 config/
 data/

v1 MVP Priority
Must Have:
1. Run ot-ctl state
2. Run ot-ctl router table
3. Run chip-tool pairing
4. Run chip-tool onoff on/off
5. Stream command output live

Nice Later:
- topology graph
- QR scanner
- node history
- auto-discovery

Recommended First Milestone
Can we control one bulb? If yes, platform works.

Build Philosophy
Not consumer-smiley-smart-home fluff.
Think: oscilloscope for your mesh.

GitHub Starter Repo
MeshBench/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── roadmap.md
│   └── commissioning-notes.md
├── backend/
├── frontend/
├── docker-compose.yml
└── LICENSE

Suggested tagline:
MeshBench: An oscilloscope for your Matter + Thread network.

Windows-first workflow
Daily driver = Windows for GitHub, VS Code, docs, browser testing, UI development.
Ubuntu backend box for OTBR, Docker runtime, chip-tool, BLE / Thread access, deployment target.

My honest recommendation for you
Do 90% of project work on Windows.
Touch Ubuntu only when testing live Thread/Matter behavior.
