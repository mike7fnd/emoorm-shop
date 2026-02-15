'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home, Package, ShoppingCart, MessageSquare, Settings,
  ChevronLeft, Store
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/supabase/provider';
import { sellerService, SellerProfile } from '@/supabase/services/seller';
import { useEffect, useState } from 'react';

const sellerNavItems = [
  { label: 'Dashboard', icon: Home, href: '/account/my-shop' },
  { label: 'Products', icon: Package, href: '/account/my-shop/products' },
  { label: 'Orders', icon: ShoppingCart, href: '/account/my-shop/orders' },
  { label: 'Messages', icon: MessageSquare, href: '/account/my-shop/messages' },
  { label: 'Settings', icon: Settings, href: '/account/my-shop/settings' },
];

export function DesktopSellerSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const profile = await sellerService.getSellerProfile(user.id);
        setSellerProfile(profile);
      } catch (err) {
        console.error('Failed to load seller profile:', err);
      }
    };
    loadProfile();
  }, [user?.id]);

  const shopInitial = sellerProfile?.shop_name?.charAt(0).toUpperCase() || 'S';

  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-4">
      {/* Back to Account */}
      <Link
        href="/account"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Account</span>
      </Link>

      {/* Shop Profile */}
      <div className="flex items-center gap-3 px-3 py-3 mb-1">
        <Avatar className="h-10 w-10 border border-primary">
          <AvatarImage src={sellerProfile?.shop_logo} alt={sellerProfile?.shop_name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
            {shopInitial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{sellerProfile?.shop_name || 'My Shop'}</p>
          <p className="text-[11px] text-muted-foreground">
            {sellerProfile?.is_verified ? '✓ Verified' : 'Pending'}
          </p>
        </div>
      </div>

      <div className="my-1.5 border-t border-gray-200/60 mx-3" />

      {/* Navigation */}
      <nav className="space-y-0.5">
        {sellerNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* View Store Link */}
      {sellerProfile && (
        <>
          <div className="my-1.5 border-t border-gray-200/60 mx-3" />
          <Link
            href={`/stores/${sellerProfile.id}`}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Store className="h-4 w-4" />
            <span>View Public Store</span>
          </Link>
        </>
      )}
    </aside>
  );
}
