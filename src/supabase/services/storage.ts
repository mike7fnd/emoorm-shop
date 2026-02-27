'use client';

import { getSupabaseClient } from '@/supabase/client';

/**
 * Supabase Storage service for uploading images
 * Uses buckets: avatars, product-images, store-images
 */

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

export const storageService = {
  /**
   * Upload a file to a Supabase storage bucket.
   * Returns the public URL of the uploaded file.
   */
  uploadFile: async (
    bucket: string,
    folder: string,
    file: File
  ): Promise<string | null> => {
    const supabase = getSupabaseClient();

    // Generate a unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}/${generateId()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error(`Storage upload error (${bucket}/${fileName}):`, error);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  /**
   * Delete a file from storage by its public URL.
   */
  deleteFile: async (bucket: string, publicUrl: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    // Extract path from public URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const parts = publicUrl.split(`/storage/v1/object/public/${bucket}/`);
    if (parts.length < 2) return false;

    const path = decodeURIComponent(parts[1]);
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error(`Storage delete error (${bucket}/${path}):`, error);
      return false;
    }
    return true;
  },

  /**
   * Upload a user avatar. Returns the public URL.
   */
  uploadAvatar: async (userId: string, file: File): Promise<string | null> => {
    return storageService.uploadFile('avatars', userId, file);
  },

  /**
   * Upload a product image. Returns the public URL.
   */
  uploadProductImage: async (sellerId: string, file: File): Promise<string | null> => {
    return storageService.uploadFile('product-images', sellerId, file);
  },

  /**
   * Upload a store image (logo, banner, photo). Returns the public URL.
   */
  uploadStoreImage: async (sellerId: string, file: File): Promise<string | null> => {
    return storageService.uploadFile('store-images', sellerId, file);
  },
};
