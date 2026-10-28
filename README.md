# ScamShield AI: Real-Time Voice Scam & Financial Fraud Defense for Mobile

> **Engineered by Yug** | Tailored for High-Trust Mobile & Fintech Ecosystems  
> Continuous AI audio stream classification defending Indian smartphone users against voice fraud, SEBI impersonation, Demat freeze threats, and UPI collect traps.

---

## 🎯 Problem Statement (The Indian Fintech Vulnerability)

While modern banking and stockbroking platforms implement strict 2FA, biometric authentication, and multi-layered encryption, **fraudsters circumvent technical security controls via human social engineering over voice calls**:

1. **Fake SEBI Research Analysts:** Fraudsters impersonate SEBI-registered advisors, presenting fake certificates and promising 300%–500% guaranteed returns on upcoming IPO allotments or private F&O pools.
2. **Demat Account Freeze Phishing:** Callers pose as Depository (CDSL/NSDL) or brokerage customer support, warning that the user's demat portfolio will be permanently locked within hours unless they download remote desktop apps (AnyDesk, QuickSupport) or disclose SMS OTPs.
3. **UPI "Receive Money" PIN Traps:** Scammers initiate collect requests disguised as refunds for failed mutual fund orders or dividend credits, urging victims to enter their UPI PIN to "receive credit".
4. **Digital Arrest & Police Impersonation:** Pressure tactics intimidating victims with fake money laundering investigations or illegal parcel deliveries to extort immediate bank transfers.

**ScamShield solves this directly at the mobile OS boundary** by listening to the live call audio, generating real-time transcription frames, and scoring conversational intent against known financial scam vectors with a fine-tuned DistilBERT NLP model.

---

## ✨ Core Capabilities

* **Sub-Second Voice Stream Classification:** Captures live audio in 10-second sliding buffers, streaming base64 payloads to an NLP pipeline scoring fraud probability (0–100%).
* **Fintech-Specific Fraud Heuristics:** Fine-tuned to recognize urgency cues, unauthorized SEBI regulatory claims, remote screen-sharing triggers, and OTP/PIN requests.
* **Three-Tier Visual & Haptic Alerts:**
  - 🟢 **Safe Call (0–25%):** Clean conversation line.
  - 🟡 **Suspicious (26–60%):** Unverified investment tips or high urgency.
  - 🔴 **Critical Scam (61–100%):** High-risk financial fraud; triggers emergency hang-up HUD and National Cyber Crime (1930) reporting action.
* **Interactive Scam Simulators:** Built-in mobile testing modes simulating real-world fraud scenarios (Fake SEBI Advisor, Demat KYC Freeze, UPI Collect Trap) for demonstration and offline evaluation.
* **Zero-Knowledge Privacy (DPDP Compliant):**
  - Caller phone numbers are hashed at rest with keyed HMAC-SHA256 (no plaintext phone numbers ever stored).
  - Transient voice audio frames are held only in RAM and purged after inference under a 30-day retention window.
* **Continuous Retraining Feedback Loop:** User-submitted flags ("Correct Verdict" vs. "False Positive") feed directly into model retraining pipelines (`src/train.py --retrain`).

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│        ScamShield React Native Client (Expo SDK 57)    │
│  - New Architecture + Hermes Bytecode Engine           │
│  - 32 KB ArrayBuffer Slicing for Zero-Crash Base64     │
│  - Real-Time Audio Waveform & Threat Gauge HUD         │
└───────────────────────────┬────────────────────────────┘
                            │ Base64 Audio Chunk Stream (HTTP POST)
                            ▼
┌────────────────────────────────────────────────────────┐
│            FastAPI Backend Engine (src/backend.py)     │
│  - pydub + ffmpeg: Decodes multi-format audio into WAV │
│  - SpeechRecognition: Speech-to-Text Transcription    │
│  - DistilBERT Scam Classifier (src/predict.py)        │
│  - SQLite3 DB (src/db.py): Keyed-HMAC Call Telemetry   │
└───────────────────────────┬────────────────────────────┘
                            ▼
           { scam_probability: 0.94, status: "Scam",
             transcription: "...", category: "SEBI Fraud" }
```

**Tech Stack:**
* **Mobile Frontend:** React Native 0.86, Expo SDK 57, Expo Router v57 (file-based routing), Reanimated, expo-audio, expo-haptics, TypeScript (Strict).
* **AI & Backend:** Python 3.12+, FastAPI, PyTorch 2.6+, HuggingFace Transformers (DistilBERT), SpeechRecognition, pydub, SQLite3, uv.

---

## 📱 Mobile Screens Overview

| Screen | Route | Key Features |
|---|---|---|
| **Launch Hero** | `app/index.tsx` | Fintech security branding, value highlights, and quick launch |
| **Shield Dashboard** | `app/(tabs)/landing.tsx` | Live status badge, metrics (99.2% accuracy, ₹4.8L protected), quick actions, live Indian scam feed |
| **Call Monitor & Keypad** | `app/call.tsx` | Haptic dialpad, flagged callers carousel, direct shield trigger |
| **Live Audio Shield** | `app/recordscam.tsx` | Real-time threat gauge (0-100%), audio equalizer, live transcript stream, interactive scam simulators |
| **Call Logs & Telemetry** | `app/(tabs)/history.tsx` | Filterable call history, risk score badges, masked caller IDs, feedback verification loop |
| **Fintech Fraud Academy** | `app/studyscam.tsx` | Interactive playbooks (SEBI fraud, Demat freeze, UPI trap), Spotting Quiz, Cyber Crime 1930 hotline |
| **Security & Privacy** | `app/(tabs)/setting.tsx` | On-device vs cloud toggle, DPDP compliance audit status, live backend ping diagnostic |

---

## 🚀 Getting Started

### 1. Prerequisites
* [uv](https://docs.astral.sh/uv/) (Python package & environment manager)
* **ffmpeg** on system PATH (required by pydub to decode audio)
* Node.js 18+ & npm

### 2. Backend Setup & Run

```bash
# 1. Sync dependencies
uv sync

# 2. Run backend tests (72 offline tests, no external weights needed)
uv run pytest tests/ -k "not test_train"

# 3. Train the DistilBERT model (generates model/scam_detector weights)
uv run python src/train.py

# 4. Start the FastAPI backend
# Set secret key for HMAC caller hashing (required for /save-call/)
export SCAMSHIELD_CALLER_KEY="your-secure-random-hmac-key"  # Windows: $env:SCAMSHIELD_CALLER_KEY="your-secure-random-hmac-key"
uv run python src/backend.py          # Runs at http://localhost:8000
```

Key Endpoints:
* `GET  /health/` — Liveness check and service status
* `POST /detect-scam/` — Accepts `{call_id, base64}` audio chunk → returns `{scam_probability, status, transcription}`
* `POST /save-call/` — Persists call records with keyed HMAC caller hashing
* `GET  /model-info/` — Latest model training accuracy & metadata

### 3. Frontend Setup & Run (React Native / Expo)

```bash
cd frontend

# Install locked dependencies
npm install --legacy-peer-deps

# Launch Expo development server
npx expo start
```
* Press `w` to open the Web preview.
* Press `a` to run on Android emulator or connected device.
* Press `i` to run on iOS simulator.

---

## 🧪 Quality Gates & CI

Every gate runs clean with zero warnings:

### Frontend Quality Gates (from `frontend/`):
```bash
npx tsc --noEmit          # TypeScript strict type-check (0 errors)
npx jest                  # Component and screen tests
npx knip --no-progress    # Dead code and dependency hygiene audit (0 warnings)
```

### Backend Quality Gates (from repo root):
```bash
uv run ruff check src tests        # Linting
uv run ruff format --check src     # Formatting
uv run mypy src                    # Type-checking
uv run pytest                      # 72 tests passing
```

---

## 🛡️ Privacy & Compliance Architecture (DPDP & SEBI Aligned)

* **Keyed HMAC-SHA256:** Caller phone numbers are salted and hashed before entering the database. A missing `SCAMSHIELD_CALLER_KEY` immediately returns HTTP 503 rather than falling back to plaintext.
* **30-Day Zero Voice Retention:** Transient voice audio chunks are deleted following NLP classification.
* **Granular Consent:** Users explicitly control whether anonymous transcript vectors are contributed to offline retraining models.

---

## 👤 Author Note

* **Author:** Yug  
* **Focus Areas:** High-Performance Mobile Architectures, Real-Time Audio Streaming, Native Haptics, Accessible UI/UX, and Fintech Security.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.  
Copyright (c) 2025 Yug.
