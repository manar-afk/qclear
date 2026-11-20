#!/usr/bin/env bash
# ==============================================================================
# QCLEAR - Google Cloud Run Deployment Script
# Zero API keys: Authenticates with Vertex AI via Application Default Credentials
# ==============================================================================
set -euo pipefail

# 1. Detect or read project ID
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project 2>/dev/null || echo "")}
if [ -z "${PROJECT_ID}" ]; then
  echo "ERROR: GOOGLE_CLOUD_PROJECT is not set and no active gcloud project found."
  echo "Please run: gcloud config set project <YOUR_PROJECT_ID>"
  exit 1
fi

RUN_REGION="asia-south1"
VERTEX_LOCATION=${GOOGLE_CLOUD_LOCATION:-"global"}
SERVICE_NAME="qclear"
SERVICE_ACCOUNT="qclear-runner@${PROJECT_ID}.iam.gserviceaccount.com"

echo "=========================================================="
echo "  Deploying QCLEAR to Google Cloud Run"
echo "  Project:         ${PROJECT_ID}"
echo "  Run Region:      ${RUN_REGION}"
echo "  Vertex Location: ${VERTEX_LOCATION}"
echo "  Model:           gemini-3.5-flash"
echo "  Service Account: ${SERVICE_ACCOUNT}"
echo "  Scale Bounds:    min=0, max=3"
echo "=========================================================="

# 2. Check if dedicated service account exists; if not, create it
echo "==> Ensuring service account [${SERVICE_ACCOUNT}] exists..."
if ! gcloud iam service-accounts describe "${SERVICE_ACCOUNT}" --project="${PROJECT_ID}" &>/dev/null; then
  echo "Creating service account [qclear-runner]..."
  gcloud iam service-accounts create qclear-runner \
    --display-name="QCLEAR Cloud Run Service Account" \
    --project="${PROJECT_ID}"

  echo "Assigning least-privilege role [roles/aiplatform.user]..."
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/aiplatform.user"
fi

# 3. Deploy to Cloud Run
echo "==> Deploying container to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --platform managed \
  --region "${RUN_REGION}" \
  --service-account "${SERVICE_ACCOUNT}" \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=${PROJECT_ID},GOOGLE_CLOUD_LOCATION=${VERTEX_LOCATION},GEMINI_MODEL=gemini-3.5-flash"

echo "=========================================================="
echo "  Deployment completed successfully!"
echo "  View your service at: $(gcloud run services describe ${SERVICE_NAME} --region ${RUN_REGION} --format 'value(status.url)')"
echo "=========================================================="
