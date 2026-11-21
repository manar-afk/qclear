# ==============================================================================
# QCLEAR - Google Cloud Run Deployment Script (PowerShell for Windows)
# Zero API keys: Authenticates with Vertex AI via Application Default Credentials
# ==============================================================================

param (
    [string]$ProjectId = $env:GOOGLE_CLOUD_PROJECT,
    [string]$Region = "asia-south1",
    [string]$VertexLocation = "global",
    [string]$Model = "gemini-3.5-flash"
)

if (-not $ProjectId) {
    $ProjectId = (gcloud config get-value project 2>$null)
}

if (-not $ProjectId) {
    Write-Error "ERROR: Project ID not specified and no default project found in gcloud config."
    Write-Host "Usage: .\scripts\deploy.ps1 -ProjectId 'your-gcp-project-id'" -ForegroundColor Yellow
    exit 1
}

$ServiceName = "qclear"
$ServiceAccount = "qclear-runner@$ProjectId.iam.gserviceaccount.com"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Deploying QCLEAR to Google Cloud Run" -ForegroundColor Cyan
Write-Host "  Project ID:      $ProjectId"
Write-Host "  Region:          $Region"
Write-Host "  Vertex Location: $VertexLocation"
Write-Host "  Gemini Model:    $Model"
Write-Host "  Service Account: $ServiceAccount"
Write-Host "  Instances:       Min=0, Max=3 (Scale-to-zero)"
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Enable required Google Cloud APIs
Write-Host "`n==> Step 1: Enabling required Google Cloud APIs..." -ForegroundColor Green
gcloud services enable run.googleapis.com cloudbuild.googleapis.com aiplatform.googleapis.com artifactregistry.googleapis.com --project $ProjectId

# 2. Ensure dedicated least-privilege service account exists
Write-Host "`n==> Step 2: Checking dedicated IAM service account..." -ForegroundColor Green
$saCheck = gcloud iam service-accounts describe $ServiceAccount --project $ProjectId 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating service account [qclear-runner]..." -ForegroundColor Yellow
    gcloud iam service-accounts create qclear-runner `
        --display-name="QCLEAR Runner Service Account" `
        --project $ProjectId

    Write-Host "Granting role [roles/aiplatform.user] for Vertex AI..." -ForegroundColor Yellow
    gcloud projects add-iam-policy-binding $ProjectId `
        --member="serviceAccount:$ServiceAccount" `
        --role="roles/aiplatform.user"
} else {
    Write-Host "Service account [$ServiceAccount] is ready." -ForegroundColor Green
}

# 3. Deploy container via Cloud Build to Cloud Run
Write-Host "`n==> Step 3: Building container and deploying to Cloud Run..." -ForegroundColor Green
gcloud run deploy $ServiceName `
    --source . `
    --project $ProjectId `
    --platform managed `
    --region $Region `
    --service-account $ServiceAccount `
    --allow-unauthenticated `
    --min-instances 0 `
    --max-instances 3 `
    --set-env-vars="GOOGLE_CLOUD_PROJECT=$ProjectId,GOOGLE_CLOUD_LOCATION=$VertexLocation,GEMINI_MODEL=$Model"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host "  QCLEAR DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    $serviceUrl = (gcloud run services describe $ServiceName --region $Region --project $ProjectId --format "value(status.url)")
    Write-Host "  Live Public URL: $serviceUrl" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
}
