
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const [avatarSrc, setAvatarSrc] = useState('https://picsum.photos/seed/user/40/40');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedAvatar = localStorage.getItem('user-avatar');
    if (savedAvatar) {
      setAvatarSrc(savedAvatar);
    }
    
    const handleAvatarUpdate = (event: Event) => {
        const customEvent = event as CustomEvent;
        setAvatarSrc(customEvent.detail.newAvatar);
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);
    
    return () => {
        window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, []);

  const isActive = (href: string) => pathname === href || (href === "/account" && pathname.startsWith("/account"));

  if (!isClient) {
    return (
        <nav className={cn(
            "h-16 bg-background flex justify-around items-center shadow-[0_-2px_6px_rgba(0,0,0,0.06)]",
            "pb-[env(safe-area-inset-bottom)]"
        )}>
            {/* Render a skeleton or placeholder */}
        </nav>
    );
  }

  return (
    <nav className={cn(
        "h-16 bg-background flex justify-around items-center shadow-[0_-2px_6px_rgba(0,0,0,0.06)]",
        "pb-[env(safe-area-inset-bottom)]"
    )}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs font-medium gap-1 pt-1",
            isActive(item.href) ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.href === '/account' ? (
            <Avatar className={cn(
              "h-7 w-7 border-2",
              isActive(item.href) ? "border-primary" : "border-transparent"
            )}>
              <AvatarImage src={avatarSrc} data-ai-hint="portrait" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <item.icon className="h-7 w-7" strokeWidth={1.5} />
          )}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
