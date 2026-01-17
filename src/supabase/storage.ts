import { supabase, isSupabaseConfigured } from './config';

// Get Supabase Storage URL for an image
export const getImageUrl = async (imagePath: string): Promise<string> => {
  if (!isSupabaseConfigured() || !supabase) {
    return `/${imagePath}`; // Fallback to local
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
    return `/${imagePath}`;
  } catch (error) {
    console.error(`Error getting Supabase image URL for ${imagePath}:`, error);
    return `/${imagePath}`; // Fallback to local
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
