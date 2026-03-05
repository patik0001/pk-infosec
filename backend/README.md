# PK InfoSec Backend V1

Node.js + Express API for contact/newsletter flows.

## Features

- `POST /api/contact`
- `POST /api/newsletter`
- Input validation + sanitization (email required, max field lengths)
- Security headers (`helmet`) + basic rate limiting
- Transactional emails:
  - admin notification
  - user acknowledgment
- Minimal secure storage in local JSON file (`0600` perms)

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm test
npm run dev
```

API runs on: `http://localhost:3001` (default)

## Environment

See `.env.example`:

- `PORT`
- `ADMIN_EMAIL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `FROM_EMAIL`
- `DATA_FILE`

If SMTP variables are missing, mails are safely no-oped via JSON transport (dev fallback).

## Sample Requests

```bash
curl -X POST http://localhost:3001/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice","email":"alice@example.com","subject":"Audit","message":"Need pentest quote"}'

curl -X POST http://localhost:3001/api/newsletter \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","source":"footer"}'
```
