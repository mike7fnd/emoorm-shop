'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User, Settings, MapPin, CreditCard, HelpCircle, Shield, Users,
  Bell, MessageSquare, Ticket, Store, LogOut, ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/supabase/provider';
import { useEffect, useState } from 'react';

/* Primary nav items shown directly in the sidebar */
const primaryNavItems = [
  { label: 'My Account', icon: User, href: '/account' },
  { label: 'My Orders', icon: ShoppingCart, href: '/account/orders/all' },
  { label: 'Messages', icon: MessageSquare, href: '/account/messages' },
  { label: 'Notifications', icon: Bell, href: '/account/notifications' },
];

/* Items shown inside the profile-icon dropdown */
const dropdownNavItems = [
  { label: 'Account Settings', icon: Settings, href: '/account/settings' },
  { label: 'Shipping Addresses', icon: MapPin, href: '/account/address' },
  { label: 'Payment Methods', icon: CreditCard, href: '/account/payment' },
  { type: 'separator' as const },
  { label: 'Help Center', icon: HelpCircle, href: '/account/help' },
  { label: 'Privacy Policy', icon: Shield, href: '/account/privacy' },
  { label: 'Switch Account', icon: Users, href: '/account/switch' },
];

export function DesktopAccountSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const supabase = useAuth();
  const [hasShop, setHasShop] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      try {
        const { data: sellerData } = await supabase
          .from('seller_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        setHasShop(!!sellerData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user?.id, supabase]);

  if (!user) return null;

  const isActive = (href: string) => {
    if (href === '/account/orders/all') {
      return pathname.startsWith('/account/orders');
    }
    return pathname === href;
  };

  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-4">
      {/* Primary navigation */}
      <nav className="space-y-0.5">
        {primaryNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
