
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/data';

type ProductSuggestionCardProps = {
  product: Product;
}

export function ProductSuggestionCard({ product }: ProductSuggestionCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block w-24 flex-shrink-0 group">
      <div className="relative aspect-square rounded-[15px] overflow-hidden bg-accent mb-2">
        <Image
          src={product.image.src}
          alt={product.name}
          fill
          className="object-cover"
          sizes="96px"
          data-ai-hint={product.image.hint}
        />
      </div>
      <p className="text-xs font-medium text-center truncate group-hover:underline">{product.name}</p>
    </Link>
  )
}
