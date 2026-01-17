# Firebase Storage Setup Guide

This guide will help you set up Firebase Storage to serve your images faster.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Firebase Storage

1. In your Firebase project, go to **Storage** in the left sidebar
2. Click **Get started**
3. Choose **Start in test mode** (or set up security rules if needed)
4. Select a location for your storage bucket

## Step 3: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app (you can skip hosting setup)
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and paste your Firebase config values:
   ```
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## Step 5: Upload Images to Firebase Storage

### Option A: Using Firebase Console (Easier)

1. Go to **Storage** in Firebase Console
2. Click **Upload file**
3. Create a folder called `images` (if it doesn't exist)
4. Upload all these images to the `images` folder:
   - alon.png
   - Bandit.png
   - cented.png
   - clukz.png
   - cupsey.png
   - daumen.png
   - duvall.png
   - gake.png
   - jijo2.png
   - joji.png
   - mitch.png

### Option B: Using Upload Script (Automated)

1. Make sure your `.env` file is configured
2. Run the upload script:
   ```bash
   node scripts/upload-images.js
   ```

## Step 6: Set Storage Security Rules

1. Go to **Storage** > **Rules** tab
2. Update rules to allow public read access:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /images/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null; // Only authenticated users can write
       }
     }
   }
   ```
3. Click **Publish**

## Step 7: Restart Your Dev Server

```bash
npm run dev
```

## Benefits

✅ **Faster Loading**: Images served from Firebase CDN
✅ **Better Performance**: Optimized delivery worldwide
✅ **Scalability**: Handles high traffic automatically
✅ **Automatic Optimization**: Firebase handles caching

## Troubleshooting

- **Images not loading?** Check that:
  - `.env` file exists and has correct values
  - Images are uploaded to `images/` folder in Storage
  - Storage rules allow public read access
  - Dev server was restarted after adding `.env`

- **Still using local images?** The app will automatically fallback to local images if Firebase isn't configured, so you can test locally first.

## Alternative: Image Optimization

If you prefer not to use Firebase, you can optimize images locally:

1. Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
2. Convert to WebP format for better compression
3. Reduce image dimensions if they're too large
