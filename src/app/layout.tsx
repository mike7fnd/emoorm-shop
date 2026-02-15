import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { WishlistProvider } from '@/hooks/use-wishlist';
import { CartProvider } from '@/hooks/use-cart';
import { PullToRefresh } from '@/components/layout/pull-to-refresh';
import { MainLayoutWrapper } from '@/components/layout/main-layout-wrapper';
import { SupabaseClientProvider } from '@/supabase/client-provider';
import { SupabaseErrorListener } from '@/components/SupabaseErrorListener';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { OnboardingSplash } from '@/components/onboarding/onboarding-splash';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'E-Moorm E-Commerce',
  description: 'A modern e-commerce experience for local Mindoro goods.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'E-Moorm',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* Leaflet */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin="" />

        {/* PWA - Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <OnboardingSplash />
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        <SupabaseClientProvider>
          <SupabaseErrorListener />
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
        </SupabaseClientProvider>
      </body>
    </html>
  );
}
