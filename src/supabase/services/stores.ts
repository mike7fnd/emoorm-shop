'use client';

import { getSupabaseClient } from '@/supabase/client';
import type { SellerProfile } from './seller';

export interface StorePhoto {
  id: string;
  seller_id: string;
  photo_url: string;
  photo_hint: string;
  sort_order: number;
  created_at: string;
}

export interface StoreGenre {
  id: string;
  seller_id: string;
  icon: string;
  text: string;
  created_at: string;
}

export interface StoreView {
  id: string;
  name: string;
  address: string;
  about: string;
  image: {
    src: string;
    hint: string;
  };
  rating: number;
  productCount: number;
  followers: number;
  lat: number;
  lng: number;
  genres: { icon: string; text: string }[];
  photos: { src: string; hint: string }[];
  userId: string;
}

/**
 * Store service for buyer-facing store operations
 */
export const storeService = {
  /**
   * Get all stores (seller_profiles with products) for buyer browsing
   */
  getAllStores: async (): Promise<StoreView[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data: sellers, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!sellers || sellers.length === 0) return [];

      const sellerIds = sellers.map(s => s.id);

      // Fetch genres for all stores
      const { data: genres } = await supabase
        .from('store_genres')
        .select('*')
        .in('seller_id', sellerIds);

      // Fetch photos for all stores
      const { data: photos } = await supabase
        .from('store_photos')
        .select('*')
        .in('seller_id', sellerIds)
        .order('sort_order', { ascending: true });

      // Fetch product counts
      const { data: productCounts } = await supabase
        .from('products')
        .select('seller_id')
        .eq('is_active', true)
        .in('seller_id', sellerIds);

      const genreMap = new Map<string, StoreGenre[]>();
      (genres || []).forEach(g => {
        const list = genreMap.get(g.seller_id) || [];
        list.push(g);
        genreMap.set(g.seller_id, list);
      });

      const photoMap = new Map<string, StorePhoto[]>();
      (photos || []).forEach(p => {
        const list = photoMap.get(p.seller_id) || [];
        list.push(p);
        photoMap.set(p.seller_id, list);
      });

      const countMap = new Map<string, number>();
      (productCounts || []).forEach(p => {
        countMap.set(p.seller_id, (countMap.get(p.seller_id) || 0) + 1);
      });

      return sellers.map(seller => ({
        id: seller.id,
        name: seller.shop_name || 'Unnamed Store',
        address: [seller.address, seller.city, seller.state].filter(Boolean).join(', ') || 'No address',
        about: seller.about || seller.shop_description || '',
        image: {
          src: seller.shop_banner || seller.shop_logo || 'https://placehold.co/600x400?text=Store',
          hint: 'store banner',
        },
        rating: parseFloat(seller.rating) || 0,
        productCount: countMap.get(seller.id) || 0,
        followers: seller.followers_count || 0,
        lat: seller.lat || 13.4121,
        lng: seller.lng || 121.1764,
        genres: (genreMap.get(seller.id) || []).map(g => ({ icon: g.icon, text: g.text })),
        photos: (photoMap.get(seller.id) || []).map(p => ({ src: p.photo_url, hint: p.photo_hint })),
        userId: seller.user_id,
      }));
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      return [];
    }
  },

  /**
   * Get a single store by seller_profile ID
   */
  getStoreById: async (storeId: string): Promise<StoreView | null> => {
    const supabase = getSupabaseClient();

    try {
      const { data: seller, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('id', storeId)
        .single();

      if (error) throw error;
      if (!seller) return null;

      const [genresResult, photosResult, productCountResult] = await Promise.all([
        supabase.from('store_genres').select('*').eq('seller_id', storeId),
        supabase.from('store_photos').select('*').eq('seller_id', storeId).order('sort_order', { ascending: true }),
        supabase.from('products').select('id').eq('seller_id', storeId).eq('is_active', true),
      ]);

      return {
        id: seller.id,
        name: seller.shop_name || 'Unnamed Store',
        address: [seller.address, seller.city, seller.state].filter(Boolean).join(', ') || 'No address',
        about: seller.about || seller.shop_description || '',
        image: {
          src: seller.shop_banner || seller.shop_logo || 'https://placehold.co/600x400?text=Store',
          hint: 'store banner',
        },
        rating: parseFloat(seller.rating) || 0,
        productCount: productCountResult.data?.length || 0,
        followers: seller.followers_count || 0,
        lat: seller.lat || 13.4121,
        lng: seller.lng || 121.1764,
        genres: (genresResult.data || []).map(g => ({ icon: g.icon, text: g.text })),
        photos: (photosResult.data || []).map(p => ({ src: p.photo_url, hint: p.photo_hint })),
        userId: seller.user_id,
      };
    } catch (error) {
      console.error('Failed to fetch store:', error);
      return null;
    }
  },

  /**
   * Follow a store
   */
  followStore: async (userId: string, sellerId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from('store_followers')
        .insert({ user_id: userId, seller_id: sellerId });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to follow store:', error);
      return false;
    }
  },

  /**
   * Unfollow a store
   */
  unfollowStore: async (userId: string, sellerId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from('store_followers')
        .delete()
        .eq('user_id', userId)
        .eq('seller_id', sellerId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to unfollow store:', error);
      return false;
    }
  },

  /**
   * Check if user follows a store
   */
  isFollowing: async (userId: string, sellerId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('store_followers')
        .select('id')
        .eq('user_id', userId)
        .eq('seller_id', sellerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Failed to check follow status:', error);
      return false;
    }
  },

  /**
   * Add store photo
   */
  addStorePhoto: async (sellerId: string, photoUrl: string, photoHint?: string): Promise<StorePhoto | null> => {
    const supabase = getSupabaseClient();

    try {
      // Get current max sort_order
      const { data: existing } = await supabase
        .from('store_photos')
        .select('sort_order')
        .eq('seller_id', sellerId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextOrder = (existing?.[0]?.sort_order || 0) + 1;

      const { data, error } = await supabase
        .from('store_photos')
        .insert({
          seller_id: sellerId,
          photo_url: photoUrl,
          photo_hint: photoHint || 'store photo',
          sort_order: nextOrder,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add store photo:', error);
      return null;
    }
  },

  /**
   * Remove store photo
   */
  removeStorePhoto: async (photoId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from('store_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to remove store photo:', error);
      return false;
    }
  },

  /**
   * Set store genres/badges
   */
  setStoreGenres: async (sellerId: string, genres: { icon: string; text: string }[]): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      // Delete existing genres
      await supabase.from('store_genres').delete().eq('seller_id', sellerId);

      if (genres.length > 0) {
        const { error } = await supabase
          .from('store_genres')
          .insert(genres.map(g => ({ seller_id: sellerId, icon: g.icon, text: g.text })));

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to set store genres:', error);
      return false;
    }
  },

  /**
   * Get store genres
   */
  getStoreGenres: async (sellerId: string): Promise<StoreGenre[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('store_genres')
        .select('*')
        .eq('seller_id', sellerId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch store genres:', error);
      return [];
    }
  },

  /**
   * Get store photos
   */
  getStorePhotos: async (sellerId: string): Promise<StorePhoto[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('store_photos')
        .select('*')
        .eq('seller_id', sellerId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch store photos:', error);
      return [];
    }
  },

  /**
   * Update store location (lat/lng)
   */
  updateStoreLocation: async (userId: string, lat: number, lng: number): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from('seller_profiles')
        .update({ lat, lng, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update store location:', error);
      return false;
    }
  },

  /**
   * Update store about text
   */
  updateStoreAbout: async (userId: string, about: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from('seller_profiles')
        .update({ about, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update store about:', error);
      return false;
    }
  },
};
