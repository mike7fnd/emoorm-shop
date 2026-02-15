'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, Store } from '@/lib/data';
import { products as staticProducts, stores as staticStores } from '@/lib/data';
import { productService } from '@/supabase/services/products';
import { storeService } from '@/supabase/services/stores';
import { dbProductToProduct, storeViewToStore } from '@/lib/db-adapters';

// Simple in-memory cache to avoid refetching on every component mount
let cachedProducts: Product[] | null = null;
let cachedStores: Store[] | null = null;
let loadingPromise: Promise<void> | null = null;

async function loadFromDb() {
  try {
    const [dbProducts, dbStores] = await Promise.all([
      productService.getAllProducts(),
      storeService.getAllStores(),
    ]);

    const dbConverted = dbProducts.map(dbProductToProduct);
    cachedProducts = [...dbConverted, ...staticProducts];

    const dbStoresConverted = dbStores.map(storeViewToStore);
    cachedStores = [...dbStoresConverted, ...staticStores];
  } catch (error) {
    console.error('Failed to load DB data:', error);
    cachedProducts = staticProducts;
    cachedStores = staticStores;
  }
}

function ensureLoaded(): Promise<void> {
  if (cachedProducts && cachedStores) return Promise.resolve();
  if (!loadingPromise) {
    loadingPromise = loadFromDb().finally(() => { loadingPromise = null; });
  }
  return loadingPromise;
}

/**
 * Hook that provides all products (DB + static) and a lookup function
 */
export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>(cachedProducts || staticProducts);
  const [isLoaded, setIsLoaded] = useState(!!cachedProducts);

  useEffect(() => {
    ensureLoaded().then(() => {
      setProducts(cachedProducts || staticProducts);
      setIsLoaded(true);
    });
  }, []);

  const findProduct = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  const refresh = useCallback(async () => {
    cachedProducts = null;
    cachedStores = null;
    await loadFromDb();
    setProducts(cachedProducts || staticProducts);
  }, []);

  return { products, findProduct, isLoaded, refresh };
}

/**
 * Hook for all stores
 */
export function useAllStores() {
  const [stores, setStores] = useState<Store[]>(cachedStores || staticStores);
  const [isLoaded, setIsLoaded] = useState(!!cachedStores);

  useEffect(() => {
    ensureLoaded().then(() => {
      setStores(cachedStores || staticStores);
      setIsLoaded(true);
    });
  }, []);

  return { stores, isLoaded };
}

/**
 * Invalidate the cache (call after seller makes changes)
 */
export function invalidateProductCache() {
  cachedProducts = null;
  cachedStores = null;
}
