'use client';

import { useEffect, useState } from 'react';
import { SellerPageLayout } from '@/components/layout/seller-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useUser } from '@/supabase/provider';
import { sellerService } from '@/supabase/services/seller';

export default function OrdersPage() {
  const { user } = useUser();
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await sellerService.getSellerProfile(user.id);
        setSellerProfile(profile);
      } catch (err) {
        console.error('Failed to load seller profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SellerPageLayout title="Orders">
      <div className="pt-4 md:pt-0">
        <h1 className="text-2xl font-bold mb-8">Your Orders</h1>

        <div className="text-center py-16 bg-muted/30 rounded-[30px]">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No orders yet</h3>
          <p className="text-muted-foreground">Orders from your customers will appear here. Once you have products, customer orders will be listed here.</p>
        </div>
      </div>
    </SellerPageLayout>
  );
}
