'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Wallet, Package, Truck, Star } from 'lucide-react';
import Link from 'next/link';

const orderStatuses = [
  { name: 'To Pay', icon: Wallet, href: '/account/orders/to-pay', count: 1 },
  { name: 'To Ship', icon: Package, href: '/account/orders/to-ship', count: 2 },
  { name: 'To Receive', icon: Truck, href: '/account/orders/to-receive', count: 1 },
  { name: 'To Review', icon: Star, href: '/account/orders/to-review', count: 3 },
];


export default function AccountPage() {
  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="flex flex-col items-center md:items-start md:flex-row md:gap-8 mb-8">
            <Avatar className="h-24 w-24 mb-4 md:mb-0 border-2 border-primary">
                <AvatarImage src="https://picsum.photos/seed/user/100/100" data-ai-hint="portrait" />
                <AvatarFallback>
                    <User className="h-10 w-10" />
                </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left md:mt-4">
                <h1 className="text-2xl font-bold">John Doe</h1>
                <p className="text-muted-foreground">john.doe@example.com</p>
            </div>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around">
                {orderStatuses.map((status) => (
                  <Link href={status.href} key={status.name} className="flex flex-col items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <div className="relative">
                      <status.icon className="h-6 w-6" />
                      {status.count > 0 && (
                        <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                          {status.count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium">{status.name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                You have no previous orders.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center md:justify-start">
            <Button variant="outline" className="rounded-[30px]">Sign Out</Button>
        </div>
      </main>
    </>
  );
}
