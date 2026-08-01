Railway deployment steps

1. Create a Railway account at https://railway.app and connect your GitHub account.
2. Create a new project -> Deploy from GitHub -> choose BabPhilip/philip-mdd-bot.
3. Set environment variables in the Railway project (Settings -> Variables):
   - ACCESS_TOKEN
   - PHONE_NUMBER_ID
   - VERIFY_TOKEN
   - HF_API_TOKEN (optional)
   - HF_MODEL (optional)
   - API_VERSION (optional)
4. Deploy, then copy the HTTPS URL (e.g., https://project-name.up.railway.app).
5. In your Meta (Facebook) Developer Console, set the webhook URL to: https://<your-railway-url>/webhook and enter the VERIFY_TOKEN. Verify the webhook.

Testing
- Send a WhatsApp message to your phone number connected to the WhatsApp Business account and check the webhook logs in Railway.

