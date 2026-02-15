'use client';

import type { Product, Store, StoreGenre } from '@/lib/data';
import type { DbProduct } from '@/supabase/services/products';
import type { StoreView } from '@/supabase/services/stores';

/**
 * Convert a Supabase DbProduct to the app's Product type
 */
export function dbProductToProduct(dbProduct: DbProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || '',
    price: dbProduct.price,
    image: {
      src: dbProduct.image_url || 'https://placehold.co/400x400?text=Product',
      hint: dbProduct.image_hint || 'product image',
    },
    category: dbProduct.category || 'Uncategorized',
    brand: dbProduct.seller_profiles?.shop_name || 'Unknown Store',
    onSale: dbProduct.on_sale,
    stock: dbProduct.stock,
    dateAdded: dbProduct.created_at,
    popularity: dbProduct.popularity || 0.5,
    sold: dbProduct.sold || 0,
    rating: dbProduct.rating || undefined,
    isAuction: dbProduct.is_auction,
    currentBid: dbProduct.current_bid || undefined,
    bidEndTime: dbProduct.bid_end_time || undefined,
  };
}

/**
 * Convert a StoreView to the app's Store type
 */
export function storeViewToStore(storeView: StoreView): Store {
  return {
    id: storeView.id,
    name: storeView.name,
    address: storeView.address,
    about: storeView.about,
    image: storeView.image,
    rating: storeView.rating,
    productCount: storeView.productCount,
    followers: storeView.followers,
    lat: storeView.lat,
    lng: storeView.lng,
    genres: storeView.genres as StoreGenre[],
  };
}
