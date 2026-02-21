'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User, Settings, MapPin, CreditCard, HelpCircle, Shield, Users,
  Bell, MessageSquare, Ticket, Store, LogOut, ShoppingCart, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/supabase/provider';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/supabase/auth';
import { Separator } from '@/components/ui/separator';

/* Primary nav items */
const primaryNavItems = [
  { label: 'My Account', icon: User, href: '/account' },
  { label: 'My Orders', icon: ShoppingCart, href: '/account/orders/all' },
  { label: 'Messages', icon: MessageSquare, href: '/account/messages' },
  { label: 'Notifications', icon: Bell, href: '/account/notifications' },
  { label: 'My Vouchers', icon: Ticket, href: '/account/vouchers' },
];

/* Settings nav items */
const settingsNavItems = [
  { label: 'Account Settings', icon: Settings, href: '/account/settings' },
  { label: 'Shipping Addresses', icon: MapPin, href: '/account/address' },
  { label: 'Payment Methods', icon: CreditCard, href: '/account/payment' },
];

/* Support nav items */
const supportNavItems = [
  { label: 'Help Center', icon: HelpCircle, href: '/account/help' },
  { label: 'Privacy Policy', icon: Shield, href: '/account/privacy' },
  { label: 'Switch Account', icon: Users, href: '/account/switch' },
];

export function DesktopAccountSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const supabase = useAuth();
  const [hasShop, setHasShop] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('https://picsum.photos/seed/user/100/100');

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

        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (profileData?.avatar_url) {
          setAvatarSrc(profileData.avatar_url);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();

    const handleAvatarUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      setAvatarSrc(customEvent.detail.newAvatar);
    };
    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdate);
  }, [user?.id, supabase]);

  if (!user) return null;

  const userEmail = user.email || 'User';
  const userName = user.user_metadata?.name || userEmail.split('@')[0] || 'User';
  const userAvatar = user.user_metadata?.avatar_url || avatarSrc;

  const isActive = (href: string) => {
    if (href === '/account/orders/all') {
      return pathname.startsWith('/account/orders');
    }
    return pathname === href;
  };

  const handleSignOut = async () => {
    await auth.signOut(supabase);
  };

  const NavItem = ({ item }: { item: { label: string; icon: any; href: string } }) => (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
        isActive(item.href)
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      )}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1">{item.label}</span>
      <ChevronRight className={cn(
        'h-4 w-4 opacity-0 -translate-x-1 transition-all',
        isActive(item.href) ? 'opacity-60 translate-x-0' : 'group-hover:opacity-40 group-hover:translate-x-0'
      )} />
    </Link>
  );

  return (
    <aside className="hidden md:flex flex-col w-[260px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto bg-white rounded-2xl shadow-sm p-2">
      {/* User profile card */}
      <div className="flex items-center gap-3 px-3 py-4 mb-2">
        <Avatar className="h-11 w-11 border-2 border-primary/20 shadow-sm">
          <AvatarImage src={userAvatar} data-ai-hint="portrait" />
          <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{userName}</p>
          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
        </div>
      </div>

      <Separator className="mb-2" />

      {/* Primary navigation */}
      <nav className="space-y-0.5 px-1">
        {primaryNavItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Seller link */}
      <div className="px-1 mt-1">
        <NavItem item={{
          label: hasShop ? 'My Shop' : 'Be a Seller',
          icon: Store,
          href: hasShop ? '/account/my-shop' : '/account/seller-registration',
        }} />
      </div>

      <Separator className="my-3" />

      {/* Settings section */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-1.5">Settings</p>
      <nav className="space-y-0.5 px-1">
        {settingsNavItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <Separator className="my-3" />

      {/* Support section */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-1.5">Support</p>
      <nav className="space-y-0.5 px-1">
        {supportNavItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <Separator className="my-3" />

      {/* Sign out */}
      <div className="px-1 pb-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
