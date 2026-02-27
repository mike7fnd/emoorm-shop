'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const sellerNavItems = [
  { label: 'Dashboard', icon: Home, href: '/account/my-shop' },
  { label: 'Products', icon: Package, href: '/account/my-shop/products' },
  { label: 'Orders', icon: ShoppingCart, href: '/account/my-shop/orders' },
  { label: 'Messages', icon: MessageSquare, href: '/account/my-shop/messages' },
  { label: 'Settings', icon: Settings, href: '/account/my-shop/settings' },
];

export function SellerNav() {
  const pathname = usePathname();
  const isSellerPage = pathname?.startsWith('/account/my-shop');

  if (!isSellerPage) return null;

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={cn(
      "bg-white flex justify-around items-center shadow-[0_-2px_6px_rgba(0,0,0,0.06)]",
      "safe-area-bottom",
      "pt-2"
    )}>
      {sellerNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs font-medium gap-1 pt-1",
            isActive(item.href) ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-7 w-7" strokeWidth={1.5} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
