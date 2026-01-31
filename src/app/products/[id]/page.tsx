'use client';

import { notFound, useParams } from 'next/navigation';
import { products } from '@/lib/data';
import { ProductDetailClientPage } from './product-detail-client-page';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = products.find((p) => p.id === params.id);

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
    <ProductDetailClientPage
      product={product}
      reviewSummary={reviewSummary}
      similarProducts={similarProducts}
    />
  );
}
