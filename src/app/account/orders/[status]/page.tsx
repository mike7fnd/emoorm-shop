'use client';

import { useParams } from 'next/navigation';
import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { products } from '@/lib/data';  // Mock orders use static data for now
import { OrderCard } from '@/components/account/order-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { List, Wallet, Package, Truck, Star } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-001',
    status: 'to-ship',
    date: '2024-07-20',
    total: 8000,
    items: [
      { product: products[2], quantity: 1 },
      { product: products[3], quantity: 1 },
    ],
  },
  {
    id: 'ORD-002',
    status: 'to-receive',
    date: '2024-07-19',
    total: 4500,
    items: [{ product: products[1], quantity: 1 }],
  },
  {
    id: 'ORD-003',
    status: 'to-pay',
    date: '2024-07-21',
    total: 1500,
    items: [{ product: products[0], quantity: 1 }],
  },
  {
    id: 'ORD-004',
    status: 'to-review',
    date: '2024-07-18',
    total: 7500,
    items: [{ product: products[4], quantity: 1 }],
  },
];

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

  const filteredOrders = mockOrders.filter(
    (order) => currentStatus === 'all' || order.status === currentStatus
  );

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

        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
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
