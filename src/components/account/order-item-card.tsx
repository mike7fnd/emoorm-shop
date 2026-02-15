'use client';

import Image from 'next/image';
import type { Product } from '@/lib/data';

type OrderItem = {
  product: Product;
  quantity: number;
};

type OrderItemCardProps = {
  item: OrderItem;
};

export function OrderItemCard({ item }: OrderItemCardProps) {
  return (
    <div className="flex gap-4">
      <Image
        src={item.product.image.src}
        alt={item.product.name}
        width={80}
        height={80}
        className="rounded-[15px] object-cover aspect-square"
        data-ai-hint={item.product.image.hint}
      />
      <div className="flex-1">
        <p className="font-semibold">{item.product.name}</p>
        <p className="text-sm text-muted-foreground">{item.product.brand}</p>
        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
      </div>
      <p className="font-semibold">₱{item.product.price.toFixed(2)}</p>
    </div>
  );
}
