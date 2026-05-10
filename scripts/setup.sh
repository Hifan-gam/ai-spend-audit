#!/bin/bash

# AI Spend Audit - Setup Script
# This script helps you set up the project for development

echo "🚀 AI Spend Audit - Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo "⚠️  Please edit .env.local with your credentials"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test -- --run

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed, but continuing..."
else
    echo "✅ All tests passed"
fi

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your database URL and API keys"
echo "2. Run 'npm run prisma:push' to set up the database"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "For more information, see README.md"
echo ""
