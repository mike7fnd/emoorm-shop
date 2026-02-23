import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: {
    src: string;
    hint: string;
  };
  category: string;
  brand: string;
  sellerId?: string;
  onSale?: boolean;
  stock: number;
  dateAdded: string; // ISO 8601 date string
  popularity: number; // A score from 0 to 1
  sold: number;
  rating?: number;
  isAuction?: boolean;
  currentBid?: number;
  bidEndTime?: string; // ISO 8601 date string
};

export type StoreGenre = {
  icon: string;
  text: string;
};

export type Store = {
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
  genres: StoreGenre[];
};

export const placeholderImageMap = new Map(PlaceHolderImages.map(p => [p.id, { src: p.imageUrl, hint: p.imageHint }]));

// Static mock data removed – all products & stores now come from Supabase DB
export const products: Product[] = [];

export const stores: Store[] = [];

export const categories: string[] = [];
export const brands: string[] = [];
