'use client';

import { useParams, useRouter } from 'next/navigation';
import { products as staticProducts } from '@/lib/data';
import { ProductDetailClientPage } from './product-detail-client-page';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/data';
import { productService } from '@/supabase/services/products';
import { dbProductToProduct } from '@/lib/db-adapters';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Try Supabase first
        const dbProduct = await productService.getProductById(params.id);
        if (dbProduct) {
          const p = dbProductToProduct(dbProduct);
          setProduct(p);

          // Get similar products from DB
          const dbSimilar = await productService.getProductsByCategory(dbProduct.category);
          const similar = dbSimilar
            .filter((s) => s.id !== params.id)
            .slice(0, 4)
            .map(dbProductToProduct);
          
          // If not enough DB similar products, supplement with static
          if (similar.length < 4) {
            const staticSimilar = staticProducts
              .filter((sp) => sp.category === p.category && sp.id !== p.id && !similar.find(s => s.id === sp.id))
              .slice(0, 4 - similar.length);
            setSimilarProducts([...similar, ...staticSimilar]);
          } else {
            setSimilarProducts(similar);
          }
        } else {
          // Fall back to static data
          const staticProduct = staticProducts.find((p) => p.id === params.id);
          if (staticProduct) {
            setProduct(staticProduct);
            setSimilarProducts(
              staticProducts
                .filter((p) => p.category === staticProduct.category && p.id !== staticProduct.id)
                .slice(0, 4)
            );
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        // Fall back to static
        const staticProduct = staticProducts.find((p) => p.id === params.id);
        if (staticProduct) {
          setProduct(staticProduct);
          setSimilarProducts(
            staticProducts
              .filter((p) => p.category === staticProduct.category && p.id !== staticProduct.id)
              .slice(0, 4)
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        <p className="text-muted-foreground mt-4">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mb-4">This product doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.back()} className="rounded-full">Go Back</Button>
      </div>
    );
  }

  const reviewSummary = {
    average: product.rating || 4.5,
    total: product.sold ? Math.floor(product.sold * 0.05) : 0,
    distribution: [
      { stars: 5, percentage: 70 },
      { stars: 4, percentage: 18 },
      { stars: 3, percentage: 7 },
      { stars: 2, percentage: 3 },
      { stars: 1, percentage: 2 },
    ],
  };

  return (
    <ProductDetailClientPage
      product={product}
      reviewSummary={reviewSummary}
      similarProducts={similarProducts}
    />
  );
}
