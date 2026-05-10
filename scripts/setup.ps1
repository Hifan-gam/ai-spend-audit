# AI Spend Audit - Setup Script (PowerShell)
# This script helps you set up the project for development

Write-Host "🚀 AI Spend Audit - Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Create .env.local if it doesn't exist
if (-not (Test-Path .env.local)) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item .env.example .env.local
    Write-Host "✅ .env.local created" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env.local with your credentials" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
    Write-Host ""
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm test -- --run

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Some tests failed, but continuing..." -ForegroundColor Yellow
} else {
    Write-Host "✅ All tests passed" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your database URL and API keys"
Write-Host "2. Run 'npm run prisma:push' to set up the database"
Write-Host "3. Run 'npm run dev' to start the development server"
Write-Host ""
Write-Host "For more information, see README.md"
Write-Host ""
