# Pastebin Lite

A minimal Pastebin-like application where users can create text pastes and share a link to view them.  
Pastes can optionally expire based on time (TTL) or view count.

## Features
- Create a paste with arbitrary text
- Optional time-based expiry (TTL)
- Optional view-count limit
- Shareable URL for each paste
- Safe HTML rendering (no script execution)

## Tech Stack
- Next.js (App Router)
- Node.js
- TypeScript
- Vercel KV (Redis)

## Running locally

```bash
npm install
npm run dev
