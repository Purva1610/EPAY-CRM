#!/bin/bash

# Firebase Security Rules Deployment Script for ePay CRM
# This script deploys Firestore and Realtime Database security rules

echo "🔥 Firebase Security Rules Deployment for ePay CRM"
echo "================================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed successfully"
else
    echo "✅ Firebase CLI is already installed"
fi

echo ""
echo "📋 Prerequisites Check:"
echo "1. Make sure you have created a Firebase project"
echo "2. Replace placeholder values in .env file with your Firebase credentials"
echo "3. Run 'firebase login' to authenticate with Firebase"
echo ""

# Ask user to login if not already logged in
echo "🔐 Checking Firebase authentication..."
if ! firebase login --list &> /dev/null; then
    echo "Please login to Firebase:"
    firebase login
fi

echo ""
echo "🚀 Starting deployment process..."
echo ""

# Deploy Firestore rules
echo "📄 Deploying Firestore Security Rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Firestore rules deployed successfully"
else
    echo "❌ Firestore rules deployment failed"
    exit 1
fi

echo ""

# Deploy Firestore indexes
echo "📄 Deploying Firestore Indexes..."
firebase deploy --only firestore:indexes

if [ $? -eq 0 ]; then
    echo "✅ Firestore indexes deployed successfully"
else
    echo "❌ Firestore indexes deployment failed"
    exit 1
fi

echo ""

# Deploy Realtime Database rules
echo "📄 Deploying Realtime Database Security Rules..."
firebase deploy --only database:rules

if [ $? -eq 0 ]; then
    echo "✅ Realtime Database rules deployed successfully"
else
    echo "❌ Realtime Database rules deployment failed"
    exit 1
fi

echo ""
echo "🎉 Firebase Security Rules Deployment Complete!"
echo ""
echo "📊 Summary:"
echo "- Firestore Security Rules: ✅ Deployed"
echo "- Firestore Indexes: ✅ Deployed" 
echo "- Realtime Database Rules: ✅ Deployed"
echo ""
echo "🔗 You can verify the deployment in Firebase Console:"
echo "https://console.firebase.google.com/"
echo ""
echo "📝 Next Steps:"
echo "1. Test the Firebase integration in your application"
echo "2. Verify data is being saved to Firestore"
echo "3. Check Realtime Database presence tracking"
echo "4. Monitor authentication and security rules in Firebase Console"