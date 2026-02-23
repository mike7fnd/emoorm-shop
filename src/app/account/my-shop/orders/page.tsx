'use client';

import { useEffect, useState } from 'react';
import { SellerPageLayout } from '@/components/layout/seller-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Package, Truck, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useUser } from '@/supabase/provider';
import { sellerService } from '@/supabase/services/seller';
import { orderService, OrderWithItems } from '@/supabase/services/orders';
import { useToast } from '@/hooks/use-toast';

const statusLabels: Record<string, string> = {
  'to-pay': 'Awaiting Payment',
  'to-ship': 'To Ship',
  'to-receive': 'Shipped',
  'to-review': 'Delivered',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
};

const statusColors: Record<string, string> = {
  'to-pay': 'bg-yellow-100 text-yellow-800',
  'to-ship': 'bg-blue-100 text-blue-800',
  'to-receive': 'bg-purple-100 text-purple-800',
  'to-review': 'bg-green-100 text-green-800',
  'completed': 'bg-gray-100 text-gray-800',
  'cancelled': 'bg-red-100 text-red-800',
};

export default function SellerOrdersPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const loadOrders = async (sellerId: string, status?: string) => {
    try {
      const data = await orderService.getSellerOrders(sellerId, status);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load seller orders:', err);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await sellerService.getSellerProfile(user.id);
        setSellerProfile(profile);
        if (profile) {
          await loadOrders(profile.id);
        }
      } catch (err) {
        console.error('Failed to load seller profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);
    if (sellerProfile) {
      await loadOrders(sellerProfile.id, tab === 'all' ? undefined : tab);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!sellerProfile) return;
    const success = await orderService.updateOrderStatusAsSeller(orderId, sellerProfile.id, newStatus);
    if (success) {
      toast({ title: 'Order Updated', description: `Order status changed to ${statusLabels[newStatus] || newStatus}.` });
      await loadOrders(sellerProfile.id, activeTab === 'all' ? undefined : activeTab);
    } else {
      toast({ title: 'Update Failed', description: 'Could not update order status.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <SellerPageLayout title="Orders">
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </SellerPageLayout>
    );
  }

  return (
    <SellerPageLayout title="Orders">
      <div className="pt-4 md:pt-0">
        <h1 className="text-2xl font-bold mb-6">Customer Orders</h1>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="to-pay">Awaiting Payment</TabsTrigger>
            <TabsTrigger value="to-ship">To Ship</TabsTrigger>
            <TabsTrigger value="to-receive">Shipped</TabsTrigger>
            <TabsTrigger value="to-review">Delivered</TabsTrigger>
          </TabsList>
        </Tabs>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderDate = new Date(order.created_at).toLocaleDateString('en-PH', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              });

              return (
                <Card key={order.id} className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Order #{order.order_number || order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">{orderDate}</p>
                      </div>
                      <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4 space-y-3">
                    {order.order_items?.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <Image
                          src={item.product_image || '/images/placeholder.png'}
                          alt={item.product_name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover aspect-square"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity} · ₱{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-bold">₱{order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      {order.status === 'to-ship' && (
                        <Button size="sm" className="rounded-full" onClick={() => handleUpdateStatus(order.id, 'to-receive')}>
                          <Truck className="h-4 w-4 mr-1" /> Mark as Shipped
                        </Button>
                      )}
                      {order.status === 'to-receive' && (
                        <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleUpdateStatus(order.id, 'to-review')}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Mark Delivered
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-[30px]">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No orders yet</h3>
            <p className="text-muted-foreground">Orders from your customers will appear here.</p>
          </div>
        )}
      </div>
    </SellerPageLayout>
  );
}
