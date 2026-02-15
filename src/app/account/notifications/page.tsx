
'use client';

import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { Card } from '@/components/ui/card';
import { Truck, Ticket, Star, Tag, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const mockNotifications = [
    { id: '1', icon: Truck, title: "Order Shipped", description: "Your order ORD-001 has been shipped and is on its way.", time: "5m ago", unread: true },
    { id: '2', icon: Ticket, title: "New Voucher", description: "You've received a 10% off voucher for your next purchase!", time: "1h ago", unread: true },
    { id: '3', icon: Star, title: "Rate Product", description: "Please rate your recent purchase of the Handwoven Nito Basket.", time: "3h ago", unread: false },
    { id: '4', icon: Tag, title: "Price Drop Alert", description: "The price of 'Wild Honey' in your wishlist has dropped.", time: "Yesterday", unread: false },
    { id: '5', icon: ShoppingBag, title: "Back in Stock", description: "'Dried Fish (Tuyo)' is back in stock. Order now!", time: "2 days ago", unread: false },
    { id: '6', icon: Truck, title: "Order Delivered", description: "Your order ORD-000 has been delivered. Enjoy!", time: "3 days ago", unread: false },

];


export default function NotificationsPage() {
  return (
    <AccountPageLayout title="Notifications">
      <div className="pt-4 md:pt-0">
        <h1 className="hidden md:block text-2xl font-bold mb-6">Notifications</h1>
        <Card className="rounded-[20px] shadow-card-shadow overflow-hidden">
          <ul className="divide-y">
              {mockNotifications.map(notification => (
                  <li key={notification.id} className={notification.unread ? 'bg-accent/50' : ''}>
                      <Link href="#" className="block hover:bg-accent transition-colors">
                          <div className="flex items-start gap-4 p-4">
                              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full">
                                  <notification.icon className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                  <p className="font-semibold">{notification.title}</p>
                                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                              </div>
                               <p className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</p>
                          </div>
                      </Link>
                  </li>
              ))}
          </ul>
        </Card>
      </div>
    </AccountPageLayout>
  );
}
