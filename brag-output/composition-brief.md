# HyperFrames Composition Brief: Remote-Git

## Objective
Create a 27-second cinematic launch trailer showing Remote-Git's end-to-end local Git workflow, from a laptop terminal through phone pairing and review to a GitHub push and Coming Soon reveal.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 27 seconds

## Source Material
- Project root: `apps/mobile/`
- Primary files read: `src/App.tsx`, `src/components/LandingPage.tsx`, `ConnectVisual.tsx`, `HowItWorks.tsx`, `QRScanner.tsx`, `Repositorydashboard.tsx`, `GitStatus.tsx`, `Repositorylist.tsx`, and `src/styles/landing-page.css`
- Product name: Remote-Git
- Tagline / strongest claim: “Your local Git workflow. Remotely.” / “Your code. Your machine. Your Git workflow.”
- Key UI moments: local agent terminal, device pairing, repository/workspace list, `main` status, diff review, commit and push result
- Copy that must appear verbatim:
  - `$ git status`
  - `$ npm install -g remote-git`
  - `$ remote-git start`
  - `Scan to connect.`
  - `Laptop connected` / `MacBook`
  - `C:\Users\Developer\Documents\Projects`
  - `View Changes`, `COMMIT`, and `PUSH TO GITHUB`
  - `$ git push origin main`
  - `✓ Successfully pushed to origin/main`
  - `Your code. Your machine. Your Git workflow.`
  - `COMING SOON`
- The username path and all repositories/commit/hash are demo content. Pairing uses a non-scannable visual mark with no token. Do not use the attached QR image or any live pairing payload.

## Creative Direction
- Tone preset: cinematic
- Creative direction: premium product reveal for a local-first developer tool
- Interpretation: realistic low-key desk light, restrained green connector light, cinematic camera movement, believable terminal/phone UI, and measured launch typography.
- Angle: Keep the developer's repository on the laptop, then make the phone the remote control surface. Show the actual sequence of pair, select, review, commit, and push rather than an abstract feature list.
- Hook: a laptop's `$ git status` and modified files; the developer leaves the desk as the phone enters.
- Outro: “Your code. Your machine. Your Git workflow.” Remote-Git. “Control your local Git workflow from your phone.” `COMING SOON / remote-git`.
- Avoid:
  - Generic stock footage or generic SaaS cards
  - Abstract filler animation or excessive captions
  - Real usernames, repositories, hostnames, pairing credentials, or real GitHub account information

## Visual Identity
- Background: `#05070a`
- Text: `#eef1f4`
- Accent: `#39e08a`; secondary Git state `#f5b95e`
- Display font: Montserrat; JetBrains Mono for code and device chrome
- Visual references: existing dark marketing page, green `R` logo mark, local terminal, mobile repo/status UI, green/red Git diff

## Storyboard
Use `brag-plan.md` as the creative contract. Eight individually editable scene sub-compositions:

1. Left at the desk — 4.8s — local `git status`, developer leaves, paired statements.
2. The local agent — 3s — Remote-Git reveal and install/start commands.
3. Pairing — 3s — simulated QR scan, connected MacBook state.
4. Select your project — 2.9s — neutral root path, four projects, `remote-git` selected.
5. See local changes — 3.7s — three files and mobile diff viewer.
6. Commit — 2.7s — staged files, message, tap, short hash.
7. Push to GitHub — 3.4s — phone-to-GitHub route, terminal output, success.
8. Coming soon — 3.5s — three-part message, brand, CTA, Coming Soon.

## Audio
- Audio role: cinematic support with sparse interface accents
- Audio arc: low pulse under the desk/agent, quiet scan/tap cues, one contained GitHub payoff, clean fade
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: moderate-low opening level, controlled lift under GitHub success, fade out over the final 0.8s
- Music cue guidance: bundled preset `.agents/skills/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`; use 8.74s, 17.47s, and 22.93s as optional pairing/commit/GitHub cue targets.
- Audio-reactive treatment: skipped because the local environment lacks FFmpeg and `uv` for pre-extraction. The closing pulse is deterministic, not audio-synced.
- Audio-coupled moments: terminal keystrokes, simulated scan, commit tap, route progression, GitHub success
- SFX selection guidance: low/medium high-frequency-risk files from `.agents/skills/brag/assets/sfx/sfx-analysis.md`
- Audio files: retain the selected local music and UI/reveal sounds in `composition/assets/`.

## HyperFrames Instructions
Use HyperFrames-native sub-compositions, one timed graphics host per scene, a single paused main timeline for scene transitions, and independent seek-safe sub-composition timelines for scene choreography. Keep media local. Run `npx hyperframes check --snapshots` before preview; render only after preview approval.