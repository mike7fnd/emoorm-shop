import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { CartProvider } from '@/hooks/use-cart';
import { PullToRefresh } from '@/components/layout/pull-to-refresh';
import { MainLayoutWrapper } from '@/components/layout/main-layout-wrapper';

export const metadata: Metadata = {
  title: 'E-Moorm E-Commerce',
  description: 'A modern e-commerce experience for local Mindoro goods.',
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
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
      </head>
      <body className="font-body antialiased h-full bg-background">
        <PullToRefresh>
          <div className="flex flex-col min-h-screen">
            <WishlistProvider>
              <CartProvider>
                <SidebarProvider>
                  <MainLayoutWrapper>{children}</MainLayoutWrapper>
                </SidebarProvider>
              </CartProvider>
            </WishlistProvider>
          </div>
        </PullToRefresh>
        <Toaster />
      </body>
    </html>
  );
}
