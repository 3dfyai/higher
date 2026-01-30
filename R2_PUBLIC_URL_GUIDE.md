# How to Get a Public URL for Your R2 Hero Video

You have **two options**. Use **Option A** for quick testing; use **Option B** for production (your own domain, caching, etc.).

---

## Option A: r2.dev subdomain (quickest)

Good for testing. Cloudflare gives you a URL like `https://pub-xxxx.r2.dev`.

### Steps

1. **Open Cloudflare Dashboard**  
   Go to [dash.cloudflare.com](https://dash.cloudflare.com) → log in.

2. **Go to R2**  
   Left sidebar → **R2** (under “Object Storage” / “Storage”).

3. **Open your bucket**  
   Click the bucket where you uploaded the hero video.

4. **Enable public access**  
   - Click **Settings** (bucket settings).  
   - Find **Public Development URL**.  
   - Click **Enable**.  
   - When asked “Allow Public Access?”, type **allow** and confirm.

5. **Get the public URL**  
   - In **Settings**, you’ll see **Public Bucket URL** (or similar).  
   - It looks like: `https://pub-xxxxxxxxxxxxx.r2.dev`  
   - Your video URL is: **that base URL + the object key**.

6. **Object key = path inside the bucket**  
   - In the bucket, open the **Objects** tab.  
   - Find your video file (e.g. `hero_background_test.mp4`).  
   - The **name** of the file is the object key.

7. **Full public URL**  
   ```
   https://pub-xxxxxxxxxxxxx.r2.dev/hero_background_test.mp4
   ```  
   (Replace `pub-xxxxxxxxxxxxx` with your actual subdomain and the filename with your object key. If the file is in a folder, e.g. `videos/hero_background_test.mp4`, use that path.)

8. **Test**  
   Paste that URL in a browser tab. The video should load or download.

**Note:** r2.dev is rate-limited and meant for development. For production, use Option B.

---

## Option B: Custom domain (production)

Use a subdomain you own (e.g. `media.yourdomain.com`) so you get a stable URL and can use caching.

### Prerequisites

- A domain already added to the same Cloudflare account (as a zone).

### Steps

1. **R2 → your bucket → Settings**  
   (Same as Option A, steps 1–3.)

2. **Custom Domains**  
   - Under **Custom Domains**, click **Add**.  
   - Enter the subdomain, e.g. `media.yourdomain.com`.  
   - Click **Continue**.  
   - Check the DNS record Cloudflare will create, then click **Connect Domain**.  
   - Wait until status is **Active** (refresh if needed).

3. **Public URL for the video**  
   - If the file in the bucket is `hero_background_test.mp4`, the URL is:  
     `https://media.yourdomain.com/hero_background_test.mp4`  
   - If it’s in a folder (e.g. `videos/hero_background_test.mp4`):  
     `https://media.yourdomain.com/videos/hero_background_test.mp4`

4. **Test**  
   Open that URL in a browser; the video should load.

---

## CORS (if your site is on a different domain)

If your site (e.g. `https://yoursite.com`) loads the video from R2 (e.g. `https://pub-xxx.r2.dev` or `https://media.yourdomain.com`), the bucket must allow your site’s origin.

1. In **R2** → your bucket → **Settings**.
2. Find **CORS policy** (or **CORS**).
3. Add a rule, for example:
   - **Allowed origins:** `https://yoursite.com`, `http://localhost:5173` (for local dev).
   - **Allowed methods:** `GET`.
   - **Allowed headers:** `*` (or leave as suggested).

Save. If you don’t set this, the browser may block the video request.

---

## What to give for the app

Once you have the URL that works in the browser:

- **Option A:** e.g. `https://pub-xxxxxxxxxxxxx.r2.dev/hero_background_test.mp4`
- **Option B:** e.g. `https://media.yourdomain.com/hero_background_test.mp4`

Share that full URL and we can plug it into the Hero component as the video source.
