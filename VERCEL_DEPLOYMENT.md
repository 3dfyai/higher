# Deploy to Vercel – Step-by-step

## 1. Put your project on GitHub (if it isn’t already)

1. Create a repo at [github.com/new](https://github.com/new) (e.g. `higher`).
2. In your project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/higher.git
git push -u origin main
```

Use your real GitHub username and repo name. If the repo already exists, skip `git init` and only add, commit, and push.

---

## 2. Import the project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
2. Click **Add New…** → **Project**.
3. **Import** the `higher` repository (or the one you use).
4. Leave the defaults:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build` (or `vite build`)  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`
5. **Do not click Deploy yet** – add environment variables first (Step 3).

---

## 3. Add environment variables

Before deploying, open **Environment Variables** for the project and add these.  
Use the same names and your own secret values.

### Frontend (Vite – used in the browser)

| Name | Value | Environments |
|------|--------|--------------|
| `VITE_SUPABASE_URL` | `https://hmadzkmchhdtnjxilgss.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase **anon** key | Production, Preview, Development |

### Backend (API / PFP generator – server only)

| Name | Value | Environments |
|------|--------|--------------|
| `SUPABASE_URL` | Same as `VITE_SUPABASE_URL` above | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase **service_role** key (from Project Settings → API) | Production, Preview, Development |
| `GCP_PROJECT_ID` | Your Google Cloud project ID | Production, Preview, Development |
| `GCP_LOCATION` | e.g. `us-central1` | Production, Preview, Development |
| `GCP_SERVICE_ACCOUNT_KEY` | Full JSON of your GCP service account key (single line or paste as-is) | Production, Preview, Development |

- Get **Supabase** keys: [Supabase Dashboard](https://app.supabase.com) → your project → **Settings** → **API**.
- Get **GCP** values: [Google Cloud Console](https://console.cloud.google.com) → create a service account with Vertex AI permissions → create a JSON key and use that for `GCP_SERVICE_ROLE_KEY`; use the project ID and region (e.g. `us-central1`) for the other two.

If you don’t use the PFP generator yet, you can skip the GCP variables; the rest of the site will still deploy. The PFP feature will only work after those are set.

---

## 4. Deploy

1. Click **Deploy**.
2. Wait for the build to finish.
3. Open the **Visit** link (e.g. `https://higher-xxx.vercel.app`).

Your Vite app is served from the root, and the `api/generate-pfp.ts` function is available at `/api/generate-pfp`.

---

## 5. After deployment

- **Custom domain:** Project → **Settings** → **Domains** → add your domain.
- **Env changes:** Change variables in **Settings** → **Environment Variables**, then **Deployments** → **…** on the latest deployment → **Redeploy**.
- **New code:** Push to `main` (or your connected branch); Vercel will redeploy automatically.

---

## Quick checklist

- [ ] Code is on GitHub (or connected Git provider).
- [ ] Project imported on Vercel.
- [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set.
- [ ] For PFP: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GCP_PROJECT_ID`, `GCP_LOCATION`, `GCP_SERVICE_ACCOUNT_KEY` set.
- [ ] Deploy triggered and build succeeded.
- [ ] Site and (if configured) `/api/generate-pfp` work on the Vercel URL.
