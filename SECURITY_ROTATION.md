# Security Credential Rotation Checklist

This document details the credentials, secrets, and keys that must be manually rotated by the system owner. Antigravity has purged `db.json` from git history and invalidated all active session tokens locally, but upstream services and compromised accounts must be refreshed.

---

## 1. Third-Party API Keys

| Secret Name | Service | Risk / Where It Appeared | Action Required |
| :--- | :--- | :--- | :--- |
| **`GEMINI_API_KEY`** | Google AI Studio / Gemini | Referenced in `.env` configurations and previously tested in local state (`AIzaSyDummyKeyForTestingLoadingState` in test db). | **Rotate immediately** in Google Cloud Console / Google AI Studio. Generate a new API key and update production environment variables. Revoke the old key. |

---

## 2. Database Connection Strings

| Secret Name | Service | Risk / Where It Appeared | Action Required |
| :--- | :--- | :--- | :--- |
| **`DATABASE_URL`** | PostgreSQL (Render / Supabase / Neon / Self-hosted) | Referenced in deployment documentation and environment setups. | If a live production database instance was linked during early development, rotate the database user password in your Postgres hosting dashboard and update `DATABASE_URL`. |

---

## 3. Compromised Plaintext Accounts

The following test and personal accounts previously had unhashed passwords (`mock_<password>`) committed in git history under `db.json`. Any external service using identical passwords must be updated immediately:

| Email Address | Legacy Plaintext Value | Action Required |
| :--- | :--- | :--- |
| `fahimsahmed01@gmail.com` | `Password123!` | If this password is used on any external accounts (Google, personal logins), change it immediately. |
| `backend@sprintflow.io` | `@R(.3o%password123` | Reset password upon next login (auto-migrates to bcrypt). |
| `fahmid@gmail.com` | `asdfasdf` | Reset password upon next login. |
| `alex@sprintflow.test` | `password123` | Reset password upon next login. |
| `testuser@sprintflow.io` | `password123` | Reset password upon next login. |

---

## 4. Session Tokens

- **Status:** **ALL INVALIDATED**.
- All local session tokens (`sess_*`) have been deleted from `db.json`. All users will be required to log in again with their email and password.
