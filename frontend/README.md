# ScamShield Mobile — React Native (Fintech Security Edition)

> **Engineered by Yug** | Real-time AI voice scam detection mobile client built with **React Native 0.86** and **Expo SDK 57**.

---

## 🎯 Executive Overview

ScamShield Mobile provides active voice protection against financial, investment, and identity theft scams in India. It streams live audio chunks to a fine-tuned DistilBERT NLP inference backend, providing sub-second risk classification, automated haptic alerts, and emergency hang-up workflows.

### Tailored for High-Trust Fintech Ecosystems:
* **Fake SEBI Advisory Detection:** Identifies unverified callers promising guaranteed returns on IPO allotments and options tips.
* **Demat KYC Freeze Phishing:** Flags social-engineering calls demanding remote APK installations (QuickSupport, AnyDesk) under false threats of portfolio locks.
* **UPI PIN Trap Interception:** Warns users when callers request UPI PINs for incoming refunds or dividend payouts.
* **Zero-Knowledge Privacy:** Compliant with DPDP guidelines — caller numbers are HMAC-SHA256 hashed at rest; voice chunks are purged upon inference.

---

## 🏗️ Architecture & Mobile Engineering Highlights

```
┌────────────────────────────────────────────────────────┐
│            ScamShield React Native Client             │
├──────────────────────┬─────────────────────────────────┤
│ Expo Router (v57)    │ File-based routing & Native Tabs│
│ React Native (0.86)  │ New Architecture & Hermes Engine│
│ expo-audio           │ High-fidelity chunked recording │
│ expo-crypto          │ Cryptographic random Call IDs   │
│ expo-haptics         │ Tactical feedback on threat HUD │
└──────────┬───────────┴─────────────────────────────────┘
           │ Base64 Chunk Stream (32 KB Slices)
           ▼
┌────────────────────────────────────────────────────────┐
│            FastAPI Backend + DistilBERT NLP            │
│  - POST /detect-scam/ (Audio → Speech → Inference)     │
│  - SQLite3 with Keyed HMAC caller hashing              │
└────────────────────────────────────────────────────────┘
```

### Key Technical Implementations:
1. **Hermes-Optimized Audio Slicing:**
   In `app/recordscam.tsx`, standard `btoa(String.fromCharCode(...bytes))` exceeds maximum call stack sizes for large audio chunks on Hermes. Audio buffers are sliced into `32 KB` chunks (`0x8000`) before base64 folding, eliminating memory spikes.
2. **Accessible By Design:**
   Every screen meets WCAG accessibility requirements — interactive elements feature explicit `accessibilityRole` and `accessibilityLabel` attributes, with `accessibilityState={{ busy: isRecording }}` on dynamic controls. State is never communicated by color alone.
3. **Robust Quality Gates:**
   Zero lint warnings, strict TypeScript typing (`tsc --noEmit`), offline component tests (`jest`), and zero dead code (`knip`).

---

## 📱 Navigation & Screen Directory

| Route | Screen Name | Description |
|---|---|---|
| `app/index.tsx` | Launch Hero | Welcome screen showcasing value propositions and quick start |
| `app/(tabs)/landing.tsx` | Shield Hub | Dashboard with live metrics, quick triggers, and threat feed |
| `app/(tabs)/history.tsx` | Telemetry Logs | Filterable call history with masked caller IDs and transcript snippets |
| `app/(tabs)/setting.tsx` | Security & Privacy | On-device vs cloud mode, DPDP compliance audit, backend ping |
| `app/recordscam.tsx` | Live Audio Shield | Live threat probability gauge, animated audio visualizer, interactive scam simulators |
| `app/call.tsx` | Dialer & Monitor | Keypad with haptics and recent flagged caller shortcuts |
| `app/studyscam.tsx` | Fraud Academy | Interactive playbooks on SEBI, Demat, and UPI scams + Spotting Quiz |
| `app/first.tsx` - `third.tsx` | Onboarding | 3-step walkthrough explaining NLP detection and zero-retention privacy |

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ (tested on Node 20 / 22)
* npm or bun

### Installation
```bash
cd frontend
npm install --legacy-peer-deps
```

### Start Development Server
```bash
npx expo start
```
* Press `w` to run on Expo Web.
* Press `a` to run on an Android emulator or device via Expo Go / Development build.
* Press `i` to run on iOS simulator.

---

## 🧪 Quality Gates & Testing

All frontend checks are verified and passing:

```bash
# 1. Type Check (Strict mode)
npx tsc --noEmit

# 2. Automated Component Tests (Offline)
npx jest

# 3. Dead Code & Unused Dependencies Audit
npx knip --no-progress
```

---

## 🔒 Privacy & Security Guarantees
* **No Plaintext PII:** Caller numbers are hashed with keyed HMAC-SHA256 prior to persistence.
* **Ephemeral Audio:** Voice recordings are held only in RAM/cache during active inference and immediately discarded.
* **Transparent Feedback Loop:** Users can flag false alarms or confirm true positives to trigger offline retraining.

---

**Author:** Yug  
**Focus:** High-Performance Mobile Applications & Fintech Security
