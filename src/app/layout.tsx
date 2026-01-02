import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { AuthBanner } from '@/components/layout/auth-banner';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { CartProvider } from '@/hooks/use-cart';

export const metadata: Metadata = {
  title: 'Wink E-Commerce',
  description: 'A modern e-commerce experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <div className="flex flex-col min-h-screen">
          <WishlistProvider>
            <CartProvider>
              <SidebarProvider>
                <div className="flex-1 pb-28 md:pb-0">{children}</div>
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
                  <AuthBanner />
                  <BottomNav />
                </div>
              </SidebarProvider>
            </CartProvider>
          </WishlistProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
