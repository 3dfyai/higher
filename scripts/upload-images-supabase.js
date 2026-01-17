// Script to upload images to Supabase Storage
// Run with: npm run upload-images-supabase

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate config
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase config not found!');
  console.log('\nPlease:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Add your Supabase URL and anon key to .env');
  console.log('3. Run this script again\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Images to upload
const imagesToUpload = [
  'alon.png',
  'Bandit.png',
  'cented.png',
  'clukz.png',
  'cupsey.png',
  'daumen.png',
  'duvall.png',
  'gake.png',
  'jijo2.png',
  'joji.png',
  'mitch.png'
];

async function uploadImage(imageName) {
  try {
    const imagePath = join(__dirname, '../public', imageName);
    const imageBuffer = await readFile(imagePath);
    
    console.log(`Uploading ${imageName}...`);
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(imageName, imageBuffer, {
        contentType: 'image/png',
        upsert: true // Overwrite if exists
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(imageName);

    console.log(`✓ ${imageName} uploaded: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`✗ Error uploading ${imageName}:`, error.message);
    return null;
  }
}

async function createBucketIfNeeded() {
  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error checking buckets:', listError.message);
    return false;
  }

  const imagesBucket = buckets?.find(b => b.name === 'images');
  
  if (!imagesBucket) {
    console.log('Creating "images" bucket...');
    const { error: createError } = await supabase.storage.createBucket('images', {
      public: true, // Make bucket public so images are accessible
      fileSizeLimit: 52428800, // 50MB limit
    });

    if (createError) {
      console.error('Error creating bucket:', createError.message);
      console.log('\nYou may need to create the bucket manually in Supabase Dashboard:');
      console.log('1. Go to Storage in Supabase Dashboard');
      console.log('2. Click "New bucket"');
      console.log('3. Name it "images"');
      console.log('4. Make it public\n');
      return false;
    }
    console.log('✓ Bucket created successfully\n');
  } else {
    console.log('✓ Bucket "images" already exists\n');
  }
  
  return true;
}

async function uploadAllImages() {
  console.log('Starting image uploads to Supabase Storage...\n');
  
  // Create bucket if needed
  const bucketReady = await createBucketIfNeeded();
  if (!bucketReady) {
    console.log('Please create the bucket manually and try again.');
    return;
  }
  
  const results = await Promise.all(
    imagesToUpload.map(image => uploadImage(image))
  );
  
  console.log('\n=== Upload Summary ===');
  const successful = results.filter(r => r !== null).length;
  console.log(`Successfully uploaded: ${successful}/${imagesToUpload.length}`);
  
  if (successful === imagesToUpload.length) {
    console.log('\n✓ All images uploaded successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    console.log('2. Restart your dev server');
    console.log('3. Images will now load from Supabase Storage');
  }
}

uploadAllImages().catch(console.error);
