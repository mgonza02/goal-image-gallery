#!/bin/bash

# Build script for GoalImageGallery component
echo "Building GoalImageGallery component..."

# Create build directory
mkdir -p dist

# Copy main files
cp index.js dist/
cp GoalImageGallery.js dist/
cp index.d.ts dist/
cp package.json dist/
cp README.md dist/

# Copy directories
cp -r components dist/
cp -r hooks dist/
cp -r styles dist/
cp -r utils dist/
cp -r docs dist/

# Copy documentation
cp QUICK_REFERENCE.md dist/
cp MIGRATION.md dist/
cp IMPLEMENTATION_SUMMARY.md dist/

echo "Build completed successfully!"
echo "Files are ready in the dist/ directory"
echo ""
echo "To publish as npm package:"
echo "1. cd dist"
echo "2. npm publish"
