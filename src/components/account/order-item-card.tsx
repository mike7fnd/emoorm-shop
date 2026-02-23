'use client';

import Image from 'next/image';

type OrderItemData = {
  product_name: string;
  product_image: string;
  product_brand: string;
  quantity: number;
  price: number;
};

type OrderItemCardProps = {
  item: OrderItemData;
};

export function OrderItemCard({ item }: OrderItemCardProps) {
  return (
    <div className="flex gap-4">
      <Image
        src={item.product_image || '/images/placeholder.png'}
        alt={item.product_name}
        width={80}
        height={80}
        className="rounded-[15px] object-cover aspect-square"
      />
      <div className="flex-1">
        <p className="font-semibold">{item.product_name}</p>
        <p className="text-sm text-muted-foreground">{item.product_brand}</p>
        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
      </div>
      <p className="font-semibold">₱{item.price.toFixed(2)}</p>
    </div>
  );
}
