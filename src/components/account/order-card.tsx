'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrderItemCard } from './order-item-card';
import type { Product } from '@/lib/data';

type OrderItem = {
  product: Product;
  quantity: number;
};

type Order = {
  id: string;
  status: string;
  date: string;
  total: number;
  items: OrderItem[];
};

type OrderCardProps = {
  order: Order;
};

const statusLabels: { [key: string]: string } = {
  'to-pay': 'To Pay',
  'to-ship': 'To Ship',
  'to-receive': 'To Receive',
  'to-review': 'To Review',
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center p-4">
        <p className="font-semibold text-sm">Order ID: {order.id}</p>
        <p className="text-sm text-primary font-medium">{statusLabels[order.status]}</p>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 space-y-4">
        {order.items.map((item, index) => (
          <OrderItemCard key={index} item={item} />
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="flex-col items-end gap-4 p-4">
        <p className="text-md">
          Order Total: <span className="font-bold text-lg">₱{order.total.toFixed(2)}</span>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-[30px]">View Details</Button>
          {order.status === 'to-pay' && <Button className="rounded-[30px]">Pay Now</Button>}
          {order.status === 'to-receive' && <Button className="rounded-[30px]">Order Received</Button>}
          {order.status === 'to-review' && <Button className="rounded-[30px]">Rate</Button>}
        </div>
      </CardFooter>
    </Card>
  );
}
