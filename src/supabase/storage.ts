import { supabase, isSupabaseConfigured } from './config';

// Get Supabase Storage URL for an image
export const getImageUrl = async (imagePath: string): Promise<string> => {
  // Always ensure local path starts with /
  const localPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  if (!isSupabaseConfigured() || !supabase) {
    return localPath; // Fallback to local
  }

  try {
    const { data } = await supabase
      .storage
      .from('images')
      .getPublicUrl(imagePath);

    if (data?.publicUrl) {
      return data.publicUrl;
    }
    
    // Fallback to local if URL not found
    return localPath;
  } catch (error) {
    console.error(`Error getting Supabase image URL for ${imagePath}:`, error);
    return localPath; // Fallback to local
  }
};

// Get all image URLs at once (for preloading)
export const getAllImageUrls = async (imagePaths: string[]): Promise<Record<string, string>> => {
  const urls: Record<string, string> = {};
  
  await Promise.all(
    imagePaths.map(async (path) => {
      urls[path] = await getImageUrl(path);
    })
  );
  
  return urls;
};
