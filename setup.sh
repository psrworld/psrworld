#!/bin/bash

# Setup script for create-psrworld CLI tool
# This script initializes the project and builds the CLI

set -e

echo "🚀 Setting up create-psrworld CLI tool..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create directories
echo "📁 Creating necessary directories..."
mkdir -p src/cli src/config src/utils tests dist bin templates .github/workflows

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: create-psrworld CLI tool setup"
fi

# Run TypeScript compilation and build
echo "🔨 Building CLI tool..."
npm run build

# Verify build
echo "🧪 Verifying build..."
node scripts/verify-build.js

# Make CLI executable
if [ -f "bin/create-psrworld.js" ]; then
    chmod +x bin/create-psrworld.js
    echo "✅ CLI executable permissions set"
fi

# Run tests
echo "🧪 Running tests..."
npm test

echo "✅ Setup complete! Your create-psrworld CLI tool is ready."
echo ""
echo "Next steps:"
echo "1. Update package.json with your package name and repository URL"
echo "2. Update README.md with your project information"
echo "3. Add your template files to templates/"
echo "4. Test the CLI: ./bin/create-psrworld.js --help"
echo "5. Link for local testing: npm link"
echo ""
echo "Available commands:"
echo "  npm run build     - Build the CLI and library"
echo "  npm run dev       - Watch mode for development"
echo "  npm test          - Run tests"
echo "  npm run lint      - Lint code"
echo "  npm run format    - Format code"
echo "  ./bin/create-psrworld.js - Run the CLI locally"