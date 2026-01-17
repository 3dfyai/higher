// Script to upload images to Firebase Storage
// Run with: npm run upload-images

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Validate config
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your-api-key') {
  console.error('❌ Error: Firebase config not found!');
  console.log('\nPlease:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Add your Firebase config to .env');
  console.log('3. Run this script again\n');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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
    const storageRef = ref(storage, `images/${imageName}`);
    
    console.log(`Uploading ${imageName}...`);
    await uploadBytes(storageRef, imageBuffer);
    const url = await getDownloadURL(storageRef);
    console.log(`✓ ${imageName} uploaded: ${url}`);
    return url;
  } catch (error) {
    console.error(`✗ Error uploading ${imageName}:`, error.message);
    return null;
  }
}

async function uploadAllImages() {
  console.log('Starting image uploads to Firebase Storage...\n');
  
  const results = await Promise.all(
    imagesToUpload.map(image => uploadImage(image))
  );
  
  console.log('\n=== Upload Summary ===');
  const successful = results.filter(r => r !== null).length;
  console.log(`Successfully uploaded: ${successful}/${imagesToUpload.length}`);
  
  if (successful === imagesToUpload.length) {
    console.log('\n✓ All images uploaded successfully!');
    console.log('\nNext steps:');
    console.log('1. Copy your Firebase config to .env file');
    console.log('2. Restart your dev server');
    console.log('3. Images will now load from Firebase Storage');
  }
}

uploadAllImages().catch(console.error);
