import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';

const PFP_PROMPT = `Generate a 1:1 aspect ratio profile picture.
Subject: Use the person from the [Second Image] as the character. Keep their facial features and identity recognizable.
Style & Pose: Copy the art style, coloring, and exact body pose (floating, arms out) from the [First Image].
Background: Replace the original background with a random, epic space scenery (nebula, stars) that matches the lighting of the character.
Output: High fidelity, 1:1 aspect ratio.`;

const MAX_USER_IMAGE_SIZE_BYTES = 7 * 1024 * 1024; // 7 MB (Vertex limit per image)
const BASE_IMAGE_STORAGE_PATH = 'duvall.png';
const GENERATED_BUCKET = 'generated-pfp';

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

function parseGcpKeyJson(raw: string): object {
  const keyJson = raw.trim();
  if (!keyJson) throw new Error('Missing GCP_SERVICE_ACCOUNT_KEY');

  // Try parse as-is
  try {
    const parsed = JSON.parse(keyJson);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch {
    // continue to fallbacks
  }

  // If wrapped in double quotes (e.g. env value "{\"type\":...}"), strip and unescape
  let unwrapped = keyJson;
  if (unwrapped.startsWith('"') && unwrapped.endsWith('"')) {
    try {
      unwrapped = JSON.parse(unwrapped) as string; // unescape the string
    } catch {
      unwrapped = keyJson.slice(1, -1).replace(/\\"/g, '"');
    }
    try {
      const parsed = JSON.parse(unwrapped);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    } catch {
      // continue
    }
  }

  // Try base64 (if key was encoded to avoid escaping in .env)
  try {
    const decoded = Buffer.from(keyJson, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch {
    // continue
  }

  const preview = keyJson.slice(0, 60).replace(/\s/g, ' ');
  throw new Error(
    `GCP_SERVICE_ACCOUNT_KEY must be valid JSON (minified, one line). Check for extra quotes, newlines, or truncation. Starts with: ${preview}...`
  );
}

async function ensureGcpCredentials(): Promise<void> {
  const raw = process.env.GCP_SERVICE_ACCOUNT_KEY ?? '';
  const parsed = parseGcpKeyJson(raw);
  const path = '/tmp/gcp-pfp-key.json';
  await mkdir('/tmp', { recursive: true }).catch(() => {});
  await writeFile(path, JSON.stringify(parsed), 'utf8');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path;
}

async function getBaseImageBase64(): Promise<{ base64: string; mimeType: string }> {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.storage.from('images').download(BASE_IMAGE_STORAGE_PATH);
    if (!error && data) {
      const buf = Buffer.from(await data.arrayBuffer());
      return { base64: buf.toString('base64'), mimeType: 'image/png' };
    }
  }
  const baseUrl = process.env.BASE_IMAGE_URL?.trim();
  if (baseUrl) {
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error(`Failed to fetch base image: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') || 'image/png';
    return { base64: buf.toString('base64'), mimeType: contentType.split(';')[0].trim() };
  }
  throw new Error(
    'Configure Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) with base image at images/duvall.png, or set BASE_IMAGE_URL to a public URL of the base style image.'
  );
}

async function uploadGeneratedToSupabase(imageBuffer: Buffer, filename: string): Promise<string> {
  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  // Assume bucket "generated-pfp" exists (create it once in Supabase Dashboard if needed)
  const { error: uploadErr } = await supabase.storage.from(GENERATED_BUCKET).upload(filename, imageBuffer, {
    contentType: 'image/png',
    upsert: true,
  });
  if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);
  const { data: urlData } = supabase.storage.from(GENERATED_BUCKET).getPublicUrl(filename);
  return urlData.publicUrl;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body as { imageBase64?: string; mimeType?: string };
    const imageBase64 = body?.imageBase64;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: 'Missing imageBase64 in body' });
      return;
    }

    const rawLength = imageBase64.length * (3 / 4);
    if (rawLength > MAX_USER_IMAGE_SIZE_BYTES) {
      res.status(400).json({ error: 'Image too large (max 7 MB)' });
      return;
    }

    await ensureGcpCredentials();

    const projectId = getEnv('GCP_PROJECT_ID');
    const location = process.env.GCP_LOCATION?.trim() || 'us-central1';

    const [baseImage, _] = await Promise.all([
      getBaseImageBase64(),
      Promise.resolve(),
    ]);

    const userMimeType = (body.mimeType as string) || 'image/jpeg';
    const normalizedUserMime = userMimeType.startsWith('image/') ? userMimeType : 'image/jpeg';

    const ai = new GoogleGenAI({
      vertexai: true,
      project: projectId,
      location,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: baseImage.base64, mimeType: baseImage.mimeType } },
            { inlineData: { data: imageBase64, mimeType: normalizedUserMime } },
            { text: PFP_PROMPT },
          ],
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: '1:1' },
      },
    });

    let imageBuffer: Buffer | undefined;
    const candidates = response.candidates;
    if (candidates?.length) {
      const parts = candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          const raw = part.inlineData?.data;
          if (raw !== undefined && raw !== null) {
            const data = typeof raw === 'string' ? raw : (raw as Uint8Array);
            imageBuffer = typeof raw === 'string'
              ? Buffer.from(raw, 'base64')
              : Buffer.from(data);
            break;
          }
        }
      }
    }
    if (!imageBuffer?.length) {
      const text = response.text ?? '';
      res.status(502).json({
        error: 'No image in response',
        detail: text.slice(0, 500),
      });
      return;
    }
    const filename = `${randomUUID()}.png`;
    const url = await uploadGeneratedToSupabase(imageBuffer, filename);

    res.status(200).json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const is429 =
      message.includes('429') ||
      message.includes('RESOURCE_EXHAUSTED') ||
      message.includes('Resource exhausted');
    if (is429) {
      res.status(429).json({
        error: 'Quota limit reached. Please try again in 5 minutes.',
      });
      return;
    }
    console.error('generate-pfp error:', err);
    res.status(500).json({ error: message });
  }
}
