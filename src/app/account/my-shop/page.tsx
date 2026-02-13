
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AccountHeader } from '@/components/layout/account-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, ShoppingCart, TrendingUp, Settings, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/supabase/provider';
import { sellerService, SellerProfile } from '@/supabase/services/seller';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSellerProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await sellerService.getSellerProfile(user.id);
        setSellerProfile(profile);
      } catch (err) {
        console.error('Failed to load seller profile:', err);
        setError('Failed to load seller profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (!userLoading) {
      loadSellerProfile();
    }
  }, [user?.id, userLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        <p className="text-muted-foreground mt-4">Loading seller dashboard...</p>
      </div>
    );
  }

  if (!sellerProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold">No Shop Found</h1>
        <p className="text-muted-foreground mb-6">You haven't registered as a seller yet.</p>
        <Button asChild className="rounded-full">
          <Link href="/account/seller-registration">Register Now</Link>
        </Button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Sales', value: '₱0.00', icon: TrendingUp },
    { label: 'Orders', value: '0', icon: ShoppingCart },
    { label: 'Products', value: '0', icon: Package },
    { label: 'Chat', value: '0', icon: MessageSquare },
  ];

  const shopInitial = sellerProfile.shop_name?.charAt(0).toUpperCase() || 'S';

  return (
    <>
      <AccountHeader title="Seller Dashboard" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={sellerProfile.shop_logo} alt={sellerProfile.shop_name} />
              <AvatarFallback>{shopInitial}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{sellerProfile.shop_name}</h1>
              <p className="text-sm text-muted-foreground">
                {sellerProfile.is_verified ? '✓ Verified Seller' : 'Pending Verification'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button variant="outline" size="sm" asChild className="rounded-full">
              <Link href={`/account/my-shop/settings`}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </Button>
            <Button size="sm" className="rounded-full" asChild>
              <Link href="/account/my-shop/products">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="rounded-2xl border-none shadow-card-shadow">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="rounded-[30px] shadow-card-shadow border-none cursor-pointer hover:shadow-lg transition-shadow" asChild>
            <Link href="/account/my-shop/products">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage your product listings</p>
                <p className="text-2xl font-bold mt-2">0</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="rounded-[30px] shadow-card-shadow border-none cursor-pointer hover:shadow-lg transition-shadow" asChild>
            <Link href="/account/my-shop/orders">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View customer orders</p>
                <p className="text-2xl font-bold mt-2">0</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="rounded-[30px] shadow-card-shadow border-none cursor-pointer hover:shadow-lg transition-shadow" asChild>
            <Link href="/account/my-shop/messages">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Customer conversations</p>
                <p className="text-2xl font-bold mt-2">0</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        <Card className="rounded-[30px] shadow-card-shadow border-none mt-8">
          <CardHeader>
            <CardTitle>Shop Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Shop Description</p>
              <p className="text-base">{sellerProfile.shop_description || 'No description added yet'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-base">
                {sellerProfile.address ? `${sellerProfile.address}, ${sellerProfile.city}, ${sellerProfile.state} ${sellerProfile.zip_code}` : 'No location added'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="text-base">{sellerProfile.contact_phone || 'No phone added'}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
