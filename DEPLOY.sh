#!/bin/bash

# PUNTA BIKERS Deployment Script
# Este script despliega la aplicación a Vercel

echo "🚀 PUNTA BIKERS Deployment Script"
echo "=================================="
echo ""

# Check if authenticated
echo "Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Not authenticated with Vercel"
    echo ""
    echo "Please run: vercel login"
    echo "Then run this script again"
    exit 1
fi

echo "✅ Authenticated with Vercel"
echo ""

# Build verification
echo "Verifying production build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Deploy
echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your application will be available at:"
echo "https://punta-bikers.vercel.app"
