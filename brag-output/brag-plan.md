# Brag Plan: Remote-Git

## Inspection rubric
1. **What is the app?** Remote-Git lets developers control the Git workflow of a repository on their laptop from a phone through a web UI.
2. **Strongest claim:** “Your code. Your machine. Your Git workflow.”
3. **Visual hook:** A working MacBook terminal remains at the desk as the developer's attention shifts to a phone; a mint connection line joins the two.
4. **Actual UI to show:** The app's QR pairing and laptop status, repository list, status/diff, commit, and push response. Keep UI terminology from the source components.
5. **Shortest satisfying video:** 27 seconds. The seven requested actions plus a readable launch close need room to register.
6. **Tone:** `cinematic`; premium technology reveal, minimal, technical, futuristic, developer-focused.
7. **Audio:** Restrained cinematic bed, subdued keyboard/scan/tap accents, a warm push-confirmation payoff.
8. **Share caption:** Remote-Git brings your local Git workflow to your phone. Your code. Your machine. Coming soon.
9. **User flow:** Work in a local repository → pair the phone to the local agent → select a repository → inspect, commit, and push changes.

## The angle
The repository never leaves the developer's laptop. Remote-Git brings the familiar Git controls to a phone, then sends the chosen commit through the laptop's own Git remote. The trailer follows one continuous action chain, ending on a confident coming-soon reveal.

## Hook (first 2-3 seconds)
Open on a real-feeling desk scene: a MacBook terminal runs `$ git status` and lists modified files. The developer leaves the desk; the phone becomes the active screen. “Your code is on your laptop.” Pauses, then “But your phone is always with you.”

## Key moments (the middle)
- A macOS-style terminal installs/starts the local agent; a pairing mark is scanned and resolves to “Laptop connected / MacBook.”
- A repository list rooted at the fictional `C:\Users\Developer\Documents\Projects` selects `remote-git`; the mobile diff shows three files and a realistic line-level change.
- A commit appears as `8f32a1c`, then the phone → Remote-Git → laptop → Git → GitHub path resolves into terminal output and “Successfully pushed to origin/main.”

## Outro / punchline
Let the connected scene fall away to near-black. “Your code. Your machine. Your Git workflow.” The Remote-Git wordmark lands, followed by “Control your local Git workflow from your phone.” and a distinct `COMING SOON / remote-git` lockup. A single connection pulse holds the last frame.

## User flow worth showing
Laptop-local repository → QR-pair phone to the local agent → select `remote-git` → review the mobile diff → commit → push through the laptop's configured Git remote. Repository names, username path, and commit/hash are illustrative demo content; the pairing mark is visual only and contains no token.

## Tone
- Preset: cinematic
- Creative direction: premium product reveal for a local-first developer tool
- Interpretation: controlled camera-like moves, deep blacks, restrained mint light, a realistic local development desk, and UI details treated like product cinematography rather than a generic software demo.

## Format: landscape — 1920x1080
## Duration: 27 seconds

## Visual identity (from the project)
- Background: `#05070a`
- Accent: `#39e08a` (secondary Git state: `#f5b95e`)
- Text: `#eef1f4`
- Display font: Montserrat, deterministic video proxy for the source site's default sans
- Body font: Montserrat; JetBrains Mono for terminal and Git UI
- Strongest visual element: the linked laptop/phone pair, authentic status/diff UI, and source green/red diff treatment

## Share copy (draft)
Remote-Git brings your local Git workflow to your phone. Your code. Your machine. Coming soon.

## Audio direction
- Role: cinematic support with sparse interface accents
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`, steady, clean, and restrained under the terminal and close
- Music treatment: begin at 0s at low/moderate level; raise slightly under the GitHub payoff; fade to silence over the final 0.8s.
- Music cue guidance: bundled preset at `.agents/skills/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`, estimated 109.96 BPM. Land pairing at 8.74s, commit at 17.47s, and GitHub confirmation at 22.93s. Sequential repository rows may use the 12.02–13.64s beat grid while remaining on screen as a complete set.
- Audio-reactive treatment: skipped because local extraction is blocked by unavailable FFmpeg and `uv`; the connection pulse is deterministic motion, not audio-synced.
- SFX posture: sparse, close-mic interface taps and one restrained warm success cue.
- Audio-coupled moments: keystrokes on the two shell commands; scan confirmation; commit tap; push success on the GitHub reveal.
- Restraint rule: no voiceover, no dense typing layer, no coin/arcade sounds, no audio overpowering the terminal.

## Storyboard

### Scene 1 — Left at the desk — 4.8s
Open already inside the developer's dark desk environment. A macOS-style terminal shows `$ git status` and modified files. The developer silhouette/keyboard action recedes; a phone is lifted into the foreground. “Your code is on your laptop.” holds, then “But your phone is always with you.” takes its place. A mint connector finds the laptop and phone.
Sequential/interaction: status command, changed-file rows, first statement, second statement, phone lift. Hold both sentences long enough to read.
Audio intent: quiet room tone into a low cinematic pulse.
Audio-coupled idea: a few discrete terminal key taps; no continuous typing spray.
Music: restrained bed begins under the desk.
Transition mood: cinematic push/crossfade → Introduce Remote-Git

### Scene 2 — The local agent — 3s
Remote-Git name resolves beside a premium terminal panel. Type `$ npm install -g remote-git`, then `$ remote-git start`; land “Local agent started.” Subtitle: “Your local Git workflow. Remotely.”
Sequential/interaction: two terminal commands type in order; the success line appears last and remains visible.
Audio intent: precise and assured.
Audio-coupled idea: sparse keyboard ticks, one low agent-start confirmation.
Music: the bed opens slightly beneath the product-name reveal.
Transition mood: soft push → Pairing

### Scene 3 — Pairing — 3s
The local terminal generates a stylized demo pairing code. A phone camera view sweeps over it; the code dissolves into the Remote-Git web UI. Show “Scan to connect.” then “Laptop connected” / “MacBook.” Pairing graphic is intentionally non-scannable; no real credential is encoded.
Sequential/interaction: code appears, scan frame crosses it, phone UI resolves, connected indicator locks in.
Audio intent: quiet anticipation, then confirmation.
Audio-coupled idea: one soft scan tap/confirmation.
Music: hit the 8.74s strong cue on the connection resolve.
Transition mood: controlled vertical wipe → Select your project

### Scene 4 — Select your project — 2.9s
The phone UI shows `C:\Users\Developer\Documents\Projects`; four repositories arrive in order: `remote-git`, `portfolio`, `college-project`, `ecommerce`. A cursor selects `remote-git`; “Repository connected” and `main` settle together.
Sequential/interaction: reveal four list rows in order, hold the complete list, tap the first row, then show connected/main.
Audio intent: tactile and exact.
Audio-coupled idea: row arrivals align loosely to the beat grid; selection gets one restrained click.
Music: steady pulse, no extra swell.
Transition mood: clean focus pull → See local changes

### Scene 5 — See local changes — 3.7s
Phone screen: `REMOTE-GIT`, `main`, `3 modified files`; `src/server/relay.ts`, `src/App.tsx`, and `src/components/GitPanel.tsx`. A simulated tap on “View Changes” expands a split green/red diff. Show “Review your changes.”
Sequential/interaction: file rows arrive in order and stay together; tap opens the diff viewer; added and removed lines settle before the supporting line.
Audio intent: make the familiar Git detail feel tangible.
Audio-coupled idea: one soft panel-open cue; no character typing sounds in the diff.
Music: low bed under the code.
Transition mood: crisp horizontal push → Commit

### Scene 6 — Commit — 2.7s
Phone UI shows “3 files staged,” the message `add remote git controls`, and a large `COMMIT` button. A cursor taps; the button presses and resolves to `8f32a1c / add remote git controls`. “Commit from anywhere.”
Sequential/interaction: stage count, commit message, button press, short hash/result. Keep the result legible through the scene end.
Audio intent: tactile action into a confident result.
Audio-coupled idea: click at button press; hash reveal near the 17.47s strong cue.
Music: subtle emphasis on commit success.
Transition mood: short camera push → Push to GitHub

### Scene 7 — Push to GitHub — 3.4s
Press `PUSH TO GITHUB`. A vertical route lights in sequence: PHONE → REMOTE-GIT → LAPTOP → GIT → GITHUB, with each connector anchored to its node. Cut into the macOS terminal: `$ git push origin main`, “Enumerating objects…”, “Writing objects…”, “Done.”, then “✓ Successfully pushed to origin/main.” A restrained GitHub wordmark/text mark caps the route.
Sequential/interaction: button press, route steps light bottom-to-top, terminal progress resolves line-by-line, GitHub success lands at 22.93s.
Audio intent: the film's sonic payoff, then immediate restraint.
Audio-coupled idea: single button click, low route ticks, warm success hit on `GitHub`.
Music: one controlled lift through the 22.93s payoff.
Transition mood: bloom-to-black → Final launch card

### Scene 8 — Coming soon — 3.5s
Fade into a clean near-black frame. Set “Your code. Your machine. Your Git workflow.” in three concise lines, then reveal `REMOTE-GIT`, “Control your local Git workflow from your phone.”, and finally `COMING SOON / remote-git`. A single mint cursor/connection pulse holds before end.
Sequential/interaction: message resolves, wordmark follows, coming-soon label lands last and holds.
Audio intent: taper to a deliberate, premium final note.
Audio-coupled idea: one subdued logo accent; connection pulse continues visually, no added beat clutter.
Music: fade out over the final 0.8s.
Transition mood: minimal fade → End

**Music mood for this video:** cinematic and restrained.
**Audio summary:** A low, modern bed follows the flow from isolated laptop to phone-driven Git, rises once on GitHub success, then leaves space for the Coming Soon lockup.