'use client';

import { getSupabaseClient } from '@/supabase/client';

export interface DbProduct {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_hint: string;
  category: string;
  stock: number;
  sold: number;
  rating: number;
  on_sale: boolean;
  is_auction: boolean;
  current_bid: number | null;
  bid_end_time: string | null;
  popularity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  seller_profiles?: {
    id: string;
    shop_name: string;
    shop_logo: string;
    shop_description: string;
    address: string;
    city: string;
  };
}

export interface CreateProductInput {
  seller_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_hint?: string;
  category: string;
  stock: number;
  on_sale?: boolean;
  is_auction?: boolean;
  current_bid?: number;
  bid_end_time?: string;
}

/**
 * Product service for managing products in Supabase
 */
export const productService = {
  /**
   * Get all active products (for buyer views)
   */
  getAllProducts: async (): Promise<DbProduct[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller_profiles (
            id,
            shop_name,
            shop_logo,
            shop_description,
            address,
            city
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Products query failed (table may not exist yet):', error.message || error.code);
        return [];
      }
      return data || [];
    } catch (error: any) {
      console.warn('Failed to fetch products:', error?.message || error);
      return [];
    }
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (productId: string): Promise<DbProduct | null> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller_profiles (
            id,
            shop_name,
            shop_logo,
            shop_description,
            address,
            city
          )
        `)
        .eq('id', productId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.warn('Product query failed (table may not exist yet):', error.message || error.code);
        }
        return null;
      }
      return data;
    } catch (error: any) {
      console.warn('Failed to fetch product:', error?.message || error);
      return null;
    }
  },

  /**
   * Get products by seller
   */
  getProductsBySeller: async (sellerId: string): Promise<DbProduct[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller_profiles (
            id,
            shop_name,
            shop_logo,
            shop_description,
            address,
            city
          )
        `)
        .eq('seller_id', sellerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Products query failed (table may not exist yet):', error.message || error.code);
        return [];
      }
      return data || [];
    } catch (error: any) {
      console.warn('Failed to fetch seller products:', error?.message || error);
      return [];
    }
  },

  /**
   * Get all products by seller (including inactive, for seller dashboard)
   */
  getAllProductsBySeller: async (sellerId: string): Promise<DbProduct[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Products query failed (table may not exist yet):', error.message || error.code);
        return [];
      }
      return data || [];
    } catch (error: any) {
      console.warn('Failed to fetch all seller products:', error?.message || error);
      return [];
    }
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (category: string): Promise<DbProduct[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller_profiles (
            id,
            shop_name,
            shop_logo,
            shop_description,
            address,
            city
          )
        `)
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      return [];
    }
  },

  /**
   * Search products
   */
  searchProducts: async (query: string): Promise<DbProduct[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller_profiles (
            id,
            shop_name,
            shop_logo,
            shop_description,
            address,
            city
          )
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('popularity', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  },

  /**
   * Create a product (seller)
   */
  createProduct: async (product: CreateProductInput): Promise<DbProduct | null> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          image_hint: product.image_hint || 'product image',
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create product:', error.message, error.code, error.details, error.hint);
        throw new Error(error.message || 'Failed to create product');
      }
      return data;
    } catch (error: any) {
      console.error('Failed to create product:', error.message || error);
      throw error;
    }
  },

  /**
   * Update a product (seller)
   */
  updateProduct: async (
    productId: string,
    updates: Partial<Omit<DbProduct, 'id' | 'seller_id' | 'created_at'>>
  ): Promise<DbProduct | null> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update product:', error);
      return null;
    }
  },

  /**
   * Delete a product (set inactive)
   */
  deleteProduct: async (productId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  },

  /**
   * Get product categories (distinct)
   */
  getCategories: async (): Promise<string[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true);

      if (error) throw error;
      const categories = [...new Set((data || []).map(p => p.category).filter(Boolean))];
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },

  /**
   * Get on-sale / deal products
   */
  getDealProducts: async (): Promise<DbProduct[]> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller_profiles (
            id,
            shop_name,
            shop_logo,
            shop_description,
            address,
            city
          )
        `)
        .eq('is_active', true)
        .eq('on_sale', true)
        .order('popularity', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch deal products:', error);
      return [];
    }
  },
};
