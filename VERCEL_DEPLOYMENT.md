# Vercel Deployment Guide

## Issue: Images Not Loading on Vercel

When you deploy to Vercel, environment variables from your `.env` file are **NOT** automatically included. You need to add them in Vercel's dashboard.

## Solution: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Select your project (`higher`)

### Step 2: Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add these two variables:

   **Variable 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://hmadzkmchhdtnjxilgss.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtYWR6a21jaGhkdG5qeGlsZ3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Njc3NzUsImV4cCI6MjA4NDI0Mzc3NX0.PKFtX6gUPopT8vBTad2s85BPsgTeOr0jfdWiKnCraWo`
   - **Environment**: Select all (Production, Preview, Development)

3. Click **Save** for each variable

### Step 3: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on your latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a new deployment

## Alternative: Use Local Images (No Supabase)

If you prefer to use local images instead of Supabase:

1. **Remove Supabase environment variables** from Vercel (or leave them empty)
2. The app will automatically fallback to local images
3. Make sure your images are in the `public/` folder
4. Redeploy

## Verify It's Working

After redeploying:

1. Check the browser console (F12) for any errors
2. Images should load from Supabase Storage URLs
3. If Supabase isn't configured, images will load from `/alon.png`, `/Bandit.png`, etc.

## Troubleshooting

**Images still not loading?**
- Check browser console for errors
- Verify environment variables are set correctly in Vercel
- Make sure images are uploaded to Supabase Storage bucket `images`
- Ensure the bucket is public and has read policies

**Want to use local images only?**
- Remove or don't set the Supabase environment variables
- Images will automatically fallback to local paths
- Make sure all images are in `public/` folder
