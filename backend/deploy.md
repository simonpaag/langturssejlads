## Deploying to Google Cloud Run

To deploy the backend to Google Cloud Run, run the following command in the `backend` directory:

```bash
gcloud run deploy langturssejlads-api \
  --source . \
  --region europe-north1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --port 8080 \
  --set-env-vars="DATABASE_URL=din_supabase_url,JWT_SECRET=din_jwt_secret,RESEND_API_KEY=din_resend_api_key,FRONTEND_URL=https://langturssejlads.dk"
```

Make sure to replace the placeholder environment variables with the actual values from your `.env` file before running the command.
