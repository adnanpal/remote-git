# Remote-Git

> Control your local Git workflow from your phone.

Remote-Git lets you remotely interact with Git repositories on your laptop from a phone or browser.

You can select a repository, check its status, review changes, stage files, commit, and push to GitHub — without opening your laptop.

## How it works

```text
Phone / Web UI
      │
      ▼
   Relay
      │
      ▼
 Local Agent
      │
      ▼
 Local Git Repository
      │
      ▼
    GitHub

The local agent runs on your laptop and performs the actual Git and filesystem operations.
The relay only handles communication between the browser and the agent.
Your source code and GitHub credentials don't need to be stored on the relay.
Features
Pair your phone with your laptop
Discover Git repositories from a selected folder
Select a repository remotely
View git status
View file changes and diffs
Stage files
Create commits
Push changes to GitHub
WebSocket-based communication
Local-first architecture
Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Backend / Agent
Node.js
TypeScript
WebSockets
Git CLI
Filesystem APIs
Infrastructure
WebSocket Relay
pnpm monorepo
Vercel

Project Structure
remote-git/
├── apps/
│   ├── agent/     # Runs on the user's laptop
│   ├── mobile/    # Web/mobile interface
│   └── relay/     # Communication relay
│
└── packages/
    ├── protocol/  # Communication protocol
    ├── crypto/    # Cryptographic utilities
   └── shared/    # Shared types/utilities

Getting Started
Prerequisites
Node.js
pnpm
Git

git clone https://github.com/<your-username>/remote-git.git
cd remote-git

pnpm install

Run
Start the required services:
pnpm dev
The exact development commands may change while the project is under active development.

The exact development commands may change while the project is under active development.
Repository Discovery
Remote-Git does not scan your entire computer.

Instead, you choose a root directory, for example:
C:\Users\Adnan\Documents\projects
The local agent searches that directory for Git repositories.
projects/
├── ecommerce/
├── portfolio/
├── chat-app/
└── remote-git/
You can then select the repository you want to control from your phone.
Security

Remote-Git follows a local-first approach.
Git operations are executed by the local agent, not by the relay server.

The relay does not need access to:
Your source code
Your filesystem
Your GitHub password
Your GitHub credentials
Your existing Git authentication is used when performing operations such as:
git push
Current Status

Remote-Git is currently under active development.

The core workflow is being built around:
Pair → Select Repository → Review Changes → Commit → Push
Some features and APIs may change before the first public release.

Roadmap
[x] Device pairing
[x] Local agent
[x] Relay communication
[x] Repository discovery
[x] Git status
[x] Diff
[x] Commit
[x] Push
[ ] Persistent device pairing
[ ] Background agent
[ ] Branch management
[ ] Commit history
[ ] Pull / Fetch
[ ] Multiple devices
[ ] Production release
Why?
Sometimes you don't need your entire development environment.
You just need to check a repository, review a change, commit it, or push it.
Remote-Git is built to make that possible from your phone.
Remote-Git
Your Git workflow. From anywhere.
