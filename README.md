# Philip MDD Bot (Phil D Wiz)

Phase 1: Core commands implemented, AI via Hugging Face, fun/games, owner/admin utilities (internal), vCard contact sending, health & deploy notes.

This repo was updated to implement Phase 1 per your approval. The bot now:
- Responds to a large static menu (rebranded as Phil D Wiz) on `menu`/`help`/`start`.
- Accepts dot-prefixed commands (e.g., `.ai`) and plain commands (e.g., `ai`).
- Provides AI replies via Hugging Face Inference when `HF_API_TOKEN` is set.
- Implements fun / games commands (rps, dice, coin, trivia) with server-side logic.
- Implements owner/admin internal commands (.addsudo, .listsudo, .ban, .unban) managing an in-memory store (persist later).
- Blocks unsafe/illegal commands with a refusal message.

Run locally
1. Copy .env.example -> .env and fill values.
2. npm install
3. npm start

Environment variables (.env.example)
- ACCESS_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN, HF_API_TOKEN (optional), HF_MODEL (optional)

Deployment
- Railway recommended. See DEPLOYMENT.md for step-by-step instructions.
