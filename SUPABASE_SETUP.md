# Supabase Storage Setup Guide (FREE!)

Supabase offers a generous free tier perfect for image hosting:
- ✅ **1 GB storage** (free)
- ✅ **2 GB bandwidth/month** (free)
- ✅ **No credit card required**
- ✅ **Fast CDN delivery**

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Supabase Credentials

1. In your project dashboard, go to **Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`
4. Copy both values

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Name it: `images`
4. Check **"Public bucket"** (important!)
5. Click **"Create bucket"**

## Step 5: Upload Images

### Option A: Using Supabase Dashboard (Easier)

1. Go to **Storage** → **images** bucket
2. Click **"Upload file"**
3. Upload all these images:
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
   npm run upload-images-supabase
   ```

## Step 6: Set Storage Policies (Make Images Public)

1. Go to **Storage** → **Policies**
2. Click on the **images** bucket
3. Click **"New Policy"**
4. Choose **"For full customization"**
5. Name it: `Allow public read access`
6. Use this SQL:
   ```sql
   (bucket_id = 'images'::text) AND (true)
   ```
7. Check **SELECT** (for reading)
8. Click **"Review"** then **"Save policy"**

Alternatively, you can use the simpler approach:
- Go to **Storage** → **images** bucket
- Click **"Policies"** tab
- Click **"New Policy"** → **"Create a policy from scratch"**
- Policy name: `Public Read Access`
- Allowed operation: `SELECT`
- Policy definition: `true` (allows everyone to read)
- Click **"Save"**

## Step 7: Restart Your Dev Server

```bash
npm run dev
```

## Benefits

✅ **100% Free** - No credit card needed
✅ **Fast CDN** - Images served globally
✅ **Easy Setup** - Simple dashboard
✅ **Automatic Optimization** - Supabase handles caching
✅ **Scalable** - Upgrade when needed

## Troubleshooting

**Images not loading?**
- Check that bucket is **public**
- Verify storage policies allow **SELECT** operations
- Make sure `.env` has correct credentials
- Restart dev server after changing `.env`

**Upload script fails?**
- Make sure bucket exists and is public
- Check that `.env` file has correct values
- Try uploading manually through dashboard first

**Still using local images?**
- The app automatically falls back to local images if Supabase isn't configured
- Check browser console for any errors

## Free Tier Limits

- **Storage**: 1 GB (plenty for ~11 images)
- **Bandwidth**: 2 GB/month (should be enough for moderate traffic)
- **File size**: 50 MB per file (your images are much smaller)

If you exceed limits, Supabase will notify you before any charges.

## Need More?

If you need more storage/bandwidth later:
- **Pro Plan**: $25/month (100 GB storage, 200 GB bandwidth)
- Or stick with free tier and optimize images

## Alternative: Optimize Images Locally

If you prefer not to use Supabase, you can optimize images:
1. Use [TinyPNG](https://tinypng.com/) to compress PNGs
2. Convert to WebP format (smaller file sizes)
3. Reduce dimensions if images are too large
