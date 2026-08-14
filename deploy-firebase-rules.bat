@echo off
REM Firebase Security Rules Deployment Script for ePay CRM
REM This script deploys Firestore and Realtime Database security rules

echo 🔥 Firebase Security Rules Deployment for ePay CRM
echo ================================================
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not found. Installing...
    call npm install -g firebase-tools
    echo ✅ Firebase CLI installed successfully
) else (
    echo ✅ Firebase CLI is already installed
)

echo.
echo 📋 Prerequisites Check:
echo 1. Make sure you have created a Firebase project
echo 2. Replace placeholder values in .env file with your Firebase credentials
echo 3. Run 'firebase login' to authenticate with Firebase
echo.

REM Ask user to login if not already logged in
echo 🔐 Checking Firebase authentication...
firebase login --list >nul 2>nul
if %errorlevel% neq 0 (
    echo Please login to Firebase:
    call firebase login
)

echo.
echo 🚀 Starting deployment process...
echo.

REM Deploy Firestore rules
echo 📄 Deploying Firestore Security Rules...
call firebase deploy --only firestore:rules

if %errorlevel% neq 0 (
    echo ❌ Firestore rules deployment failed
    exit /b 1
)
echo ✅ Firestore rules deployed successfully
echo.

REM Deploy Firestore indexes
echo 📄 Deploying Firestore Indexes...
call firebase deploy --only firestore:indexes

if %errorlevel% neq 0 (
    echo ❌ Firestore indexes deployment failed
    exit /b 1
)
echo ✅ Firestore indexes deployed successfully
echo.

REM Deploy Realtime Database rules
echo 📄 Deploying Realtime Database Security Rules...
call firebase deploy --only database:rules

if %errorlevel% neq 0 (
    echo ❌ Realtime Database rules deployment failed
    exit /b 1
)
echo ✅ Realtime Database rules deployed successfully
echo.

echo 🎉 Firebase Security Rules Deployment Complete!
echo.
echo 📊 Summary:
echo - Firestore Security Rules: ✅ Deployed
echo - Firestore Indexes: ✅ Deployed
echo - Realtime Database Rules: ✅ Deployed
echo.
echo 🔗 You can verify the deployment in Firebase Console:
echo https://console.firebase.google.com/
echo.
echo 📝 Next Steps:
echo 1. Test the Firebase integration in your application
echo 2. Verify data is being saved to Firestore
echo 3. Check Realtime Database presence tracking
echo 4. Monitor authentication and security rules in Firebase Console

pause