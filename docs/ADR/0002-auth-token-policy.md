# ADR 0002 — Auth Token Policy
Date: 2025-11-18
Decision:
- Access token: JWT, expiry 15 minutes.
- Refresh token: opaque JWT (or signed token) with expiry 7 days.
- Refresh rotation: on refresh, issue new refresh token and revoke previous (store revoked tokens in DB or use rotating ID).
- Signing: Use HMAC with a strong secret in production or RSA/ECDSA with key rotation (preferred).
- Storage: refresh tokens persisted server-side (DB table refresh_tokens) with userId, expiry, jti.
Reasoning:
- Short access TTL reduces exposure. Refresh rotation improves security.
Consequences:
- Backend must implement refresh token store and revocation; tests must cover refresh rotation.
