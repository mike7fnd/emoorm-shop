
'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Wallet, Package, Truck, Star, LogOut, MoreVertical, Settings, HelpCircle, Users, CreditCard, Shield, MapPin, Bell, MessageSquare, Ticket, Store } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

const orderStatuses = [
  { name: 'To Pay', icon: Wallet, href: '/account/orders/to-pay', count: 1 },
  { name: 'To Ship', icon: Package, href: '/account/orders/to-ship', count: 2 },
  { name: 'To Receive', icon: Truck, href: '/account/orders/to-receive', count: 1 },
  { name: 'To Review', icon: Star, href: '/account/orders/to-review', count: 3 },
];

const menuOptions = [
    { label: 'Account Settings', icon: Settings, href: '/account/settings' },
    { label: 'Shipping Addresses', icon: MapPin, href: '/account/address' },
    { label: 'Payment Methods', icon: CreditCard, href: '/account/payment' },
    { label: 'Help Center', icon: HelpCircle, href: '/account/help' },
    { label: 'Privacy Policy', icon: Shield, href: '/account/privacy' },
    { label: 'Switch Account', icon: Users, href: '/account/switch' },
];

const mockNotifications = [
    { icon: Truck, title: "Order Shipped", description: "Your order ORD-001 has been shipped.", time: "5m ago" },
    { icon: Ticket, title: "New Voucher", description: "You've received a 10% off voucher!", time: "1h ago" },
    { icon: Star, title: "Rate Product", description: "Please rate your recent purchase.", time: "3h ago" },
]

export default function AccountPage() {
  const [avatarSrc, setAvatarSrc] = useState('https://picsum.photos/seed/user/100/100');
  const [hasShop, setHasShop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('user-avatar');
    if (savedAvatar) {
      setAvatarSrc(savedAvatar);
    }
    
    const sellerProfile = localStorage.getItem('seller-profile');
    if (sellerProfile) {
      setHasShop(true);
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarSrc(result);
        localStorage.setItem('user-avatar', result);
        window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { newAvatar: result }}));
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="pb-24 md:pb-8">
         <div className="md:hidden h-16 flex items-center justify-between px-4">
            <h1 className="text-lg font-semibold">My Account</h1>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/account/messages">
                        <MessageSquare className="h-5 w-5" />
                    </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 rounded-[15px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-1">
                        {mockNotifications.map((notif, index) => (
                           <DropdownMenuItem key={index} className="flex items-start gap-3 rounded-md">
                                <notif.icon className="h-4 w-4 mt-1 text-primary" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{notif.title}</p>
                                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{notif.time}</p>
                           </DropdownMenuItem>
                        ))}
                    </div>
                    <DropdownMenuSeparator />
                     <div className="p-1">
                        <DropdownMenuItem asChild className="justify-center rounded-md">
                           <Link href="/account/notifications">
                             See All Notifications
                           </Link>
                        </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-[15px]">
                     {menuOptions.map((option) => (
                        <DropdownMenuItem key={option.label} asChild className="rounded-md">
                            <Link href={option.href}>
                                <option.icon className="mr-2 h-4 w-4" />
                                <span>{option.label}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive rounded-md">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div className="container mx-auto px-4 pt-0 md:pt-8 relative">
            <Card className="max-w-md mx-auto rounded-[30px] shadow-xl">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <button onClick={handleAvatarClick} className="relative group">
                            <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-lg">
                                <AvatarImage src={avatarSrc} data-ai-hint="portrait" />
                                <AvatarFallback>
                                    <User className="h-10 w-10" />
                                </AvatarFallback>
                            </Avatar>
                        </button>
                        <h1 className="text-2xl font-bold">John Doe</h1>
                        <p className="text-muted-foreground">john.doe@example.com</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="max-w-md mx-auto rounded-[30px] shadow-xl mt-4">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">My Orders</CardTitle>
                        <Link href="/account/orders/all" className="text-sm text-primary hover:underline">
                            View All
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="flex justify-around w-full">
                        {orderStatuses.map((status) => (
                          <Link href={status.href} key={status.name} className="flex flex-col items-center gap-1 text-foreground hover:text-primary transition-colors">
                            <div className="relative">
                                <status.icon className="h-7 w-7" strokeWidth={1.5} />
                                {status.count > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {status.count}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{status.name}</span>
                          </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="max-w-md mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                <Link href={hasShop ? "/account/my-shop" : "/account/seller-registration"}>
                    <Card className="hover:bg-accent transition-colors h-full">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                           <Image src="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kgYMsaYJpFuQ4XMNy0GYQ2zmrWOuJz.png" alt="Be a Seller" width={100} height={100} />
                           <p className="font-semibold text-sm mt-2">{hasShop ? 'My Shop' : 'Be a Seller'}</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link href="/account/vouchers">
                    <Card className="hover:bg-accent transition-colors h-full">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                           <Image src="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-xPBxqYxnSi0VmK3ALnqKVxdTMKcII9.png" alt="My Vouchers" width={100} height={100} />
                           <p className="font-semibold text-sm mt-2">My Vouchers</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link href="/account/help">
                    <Card className="hover:bg-accent transition-colors h-full">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                           <Image src="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-m3g6C1b2A0S8R9p2W6n4Q5Y7vX8Z2k.png" alt="Help Center" width={100} height={100} />
                           <p className="font-semibold text-sm mt-2">Help Center</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
      </main>
    </>
  );
}
