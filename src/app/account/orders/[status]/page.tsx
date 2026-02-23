'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { OrderCard } from '@/components/account/order-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { List, Wallet, Package, Truck, Star, Loader2 } from 'lucide-react';
import { useUser } from '@/supabase/provider';
import { orderService, OrderWithItems } from '@/supabase/services/orders';
import { useToast } from '@/hooks/use-toast';

const statusTabs = [
  { value: 'all', label: 'All', icon: List },
  { value: 'to-pay', label: 'To Pay', icon: Wallet },
  { value: 'to-ship', label: 'To Ship', icon: Package },
  { value: 'to-receive', label: 'To Receive', icon: Truck },
  { value: 'to-review', label: 'To Review', icon: Star },
];

export default function OrdersPage() {
  const params = useParams();
  const currentStatus = Array.isArray(params.status) ? params.status[0] : params.status || 'all';
  const { user } = useUser();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await orderService.getUserOrders(user.id, currentStatus);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?.id, currentStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!user?.id) return;

    const success = await orderService.updateOrderStatus(orderId, user.id, newStatus);
    if (success) {
      toast({ title: 'Order Updated', description: `Order status changed to ${newStatus.replace('-', ' ')}.` });
      loadOrders(); // Refresh
    } else {
      toast({ title: 'Update Failed', description: 'Could not update order status.', variant: 'destructive' });
    }
  };

  return (
    <AccountPageLayout title="My Orders" hideMobileHeader>
      <div className="pt-4 md:pt-0 safe-area-top md:safe-area-top-0">
        <h1 className="text-lg font-semibold mb-4 md:text-2xl md:font-bold md:mb-6">My Orders</h1>

        <Tabs defaultValue={currentStatus} className="w-full mb-8">
          <div className="border-b">
            <TabsList className="bg-transparent p-0 h-auto gap-8 justify-center w-full">
              {statusTabs.map(tab => (
                <Link href={`/account/orders/${tab.value}`} key={tab.value} passHref className={cn(
                  "flex-shrink-0",
                  tab.value === 'all' && 'hidden sm:flex'
                )}>
                  <TabsTrigger value={tab.value} className="flex flex-col gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none -mb-px pt-3 px-1 pb-2">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">You have no orders in this category.</p>
          </div>
        )}
      </div>
    </AccountPageLayout>
  );
}
