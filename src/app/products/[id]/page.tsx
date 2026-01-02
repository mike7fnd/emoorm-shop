
'use client';

import { notFound, useRouter, useParams } from 'next/navigation';
import { products } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { Separator } from '@/components/ui/separator';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductDetailClientPage } from './product-detail-client-page';
import { useState, useEffect } from 'react';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  // Find the product based on the id. This logic runs on the client.
  const product = products.find((p) => p.id === params.id);

  // Handle search redirection
  useEffect(() => {
    if (searchQuery) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, router]);
  
  if (!product) {
    notFound();
    return null;
  }

  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const reviewSummary = {
    average: 4.9,
    total: 123,
    distribution: [
      { stars: 5, percentage: 90 },
      { stars: 4, percentage: 8 },
      { stars: 3, percentage: 1 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 0 },
    ],
  };

  return (
    <>
      <Header 
        showSearch={true} 
        setSearchQuery={setSearchQuery} 
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailClientPage product={product} reviewSummary={reviewSummary} />

        <Separator className="mt-8 mb-12" />

        <div>
          <h2 className="text-xl font-bold mb-6">More Like This</h2>
          <ProductGrid products={similarProducts} />
        </div>
      </main>
    </>
  );
}
