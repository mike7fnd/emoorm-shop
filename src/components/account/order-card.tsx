'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrderItemCard } from './order-item-card';
import type { OrderWithItems } from '@/supabase/services/orders';

type OrderCardProps = {
  order: OrderWithItems;
  onUpdateStatus?: (orderId: string, status: string) => void;
};

const statusLabels: { [key: string]: string } = {
  'to-pay': 'To Pay',
  'to-ship': 'To Ship',
  'to-receive': 'To Receive',
  'to-review': 'To Review',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
};

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const orderDate = new Date(order.created_at).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center p-4">
        <div>
          <p className="font-semibold text-sm">Order: {order.order_number || order.id.slice(0, 8)}</p>
          <p className="text-xs text-muted-foreground">{orderDate}</p>
        </div>
        <p className="text-sm text-primary font-medium">{statusLabels[order.status] || order.status}</p>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 space-y-4">
        {order.order_items?.map((item, index) => (
          <OrderItemCard key={index} item={item} />
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="flex-col items-end gap-4 p-4">
        <p className="text-md">
          Order Total: <span className="font-bold text-lg">₱{order.total_amount.toFixed(2)}</span>
        </p>
        <div className="flex gap-2">
          {order.status === 'to-pay' && onUpdateStatus && (
            <Button variant="ghost" className="rounded-[30px] bg-muted text-muted-foreground shadow-none hover:bg-muted/80" onClick={() => onUpdateStatus(order.id, 'cancelled')}>
              Cancel
            </Button>
          )}
          {order.status === 'to-receive' && onUpdateStatus && (
            <Button className="rounded-[30px]" onClick={() => onUpdateStatus(order.id, 'to-review')}>
              Order Received
            </Button>
          )}
          {order.status === 'to-review' && onUpdateStatus && (
            <Button className="rounded-[30px]" onClick={() => onUpdateStatus(order.id, 'completed')}>
              Rate
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
