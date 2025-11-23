# ADR 0003 — Customizer Upload & Validation Policy
Date: 2025-11-18
Decision:
- Photo uploads: Clients upload media to Cloudinary directly and send back secure URLs to the backend.
- Server-side validation: Backend will call Cloudinary's resource metadata API for each returned URL to obtain `bytes` size and validate that total <= 50 MB (50 * 1024 * 1024).
- Rationale: offloads binary handling and simplifies Docker/local environment; preserves strict server-side enforcement of FR-9.
- Fallback: If Cloudinary metadata is unavailable, reject request and return 502/400 with guidance.
Consequences:
- Backend must have a Cloudinary service adapter and credentials (configured via environment variables).
- Security: clients MUST send signed upload results (Cloudinary upload preset or signature) to mitigate spoofing.
