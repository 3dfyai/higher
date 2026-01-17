import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

// Get Firebase Storage URL for an image
export const getImageUrl = async (imagePath: string): Promise<string> => {
  try {
    const imageRef = ref(storage, `images/${imagePath}`);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error(`Error getting image URL for ${imagePath}:`, error);
    // Fallback to local path if Firebase fails
    return `/${imagePath}`;
  }
};

// Get all image URLs at once (for preloading)
export const getAllImageUrls = async (imagePaths: string[]): Promise<Record<string, string>> => {
  const urls: Record<string, string> = {};
  
  await Promise.all(
    imagePaths.map(async (path) => {
      try {
        urls[path] = await getImageUrl(path);
      } catch (error) {
        console.error(`Error loading ${path}:`, error);
        urls[path] = `/${path}`; // Fallback
      }
    })
  );
  
  return urls;
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return import.meta.env.VITE_FIREBASE_STORAGE_BUCKET !== undefined && 
         import.meta.env.VITE_FIREBASE_STORAGE_BUCKET !== "your-project.appspot.com";
};
