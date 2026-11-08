# Notification Ninja – Optional TOTP MFA (release 3.4.0)

## Render / Neon production configuration

The server will never allow password-only login for an account with MFA enabled. Enrollment remains unavailable until the Render service has a private encryption key.

1. Open Render > notification-ninja-accounts web service > Environment.
2. Generate a random 32-byte key on a trusted PRIVATE terminal with the command: `openssl rand -hex 32` (output is 64 hex digits).
3. Add the resulting value to Render as a protected **secret environment variable** named `NINJA_MFA_KEY`. Never commit, paste into a screenshot, chat or config file.
4. Deploy the reviewed backend code to Render and check `/api/v3/health`.
5. Sign in, open your account profile, choose **MFA einrichten**, scan the private QR with an Authenticator app and submit the 6-digit TOTP.
6. Save the ten single-use recovery codes securely. They appear only after confirmation.
7. Log out and back in, verifying the server requests a separate MFA code before creating an authenticated session.

## Security guarantees

- AES-256-GCM at-rest encryption for TOTP secret, server environment key only.
- TOTP SHA-1/30-second/6-digit compatibility with common authenticator apps, with a small clock window and replay protection.
- Login challenges are random, stored hashed, single-use, five-minute expiry and maximum five attempts.
- One-time recovery codes stored as hashes, never as plaintext after issuance.
- MFA enrollment requires the account password and first authenticator code; deactivation needs password + TOTP or unused recovery code.
- Password reset with the legacy recovery key additionally requires an MFA code when enrolled; the legacy key alone cannot bypass MFA.
- Enabling/disabling MFA revokes other sessions. Existing non-MFA accounts continue working without data migration loss.
- Additive SQLite and Neon/PostgreSQL schema migration version 3 creates `ninja_mfa` and `ninja_mfa_challenges` tables. Existing profiles and balances are untouched.

## Critical operations

Do NOT casually rotate or lose `NINJA_MFA_KEY`: enrolled secrets become unreadable and protected accounts must fail closed rather than silently skipping MFA. Store the key in an appropriate private backup/secret manager. Never copy it into the repository. A GitHub Pages deployment alone does not activate MFA; the matching backend deployment and private key are required.

All recovery codes are one-time. Never send them by email or to analytics systems; they should be kept offline/securely by the account owner.
