
'use client';

import { useState, useEffect } from 'react';
import { AccountHeader } from '@/components/layout/account-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, ShoppingCart, TrendingUp, Settings, MessageSquare, ExternalLink, Truck } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MyShopPage() {
  const [shopProfile, setShopProfile] = useState<any>(null);

  useEffect(() => {
    const profile = localStorage.getItem('seller-profile');
    if (profile) {
      setShopProfile(JSON.parse(profile));
    }
  }, []);

  if (!shopProfile) {
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

  return (
    <>
      <AccountHeader title="Seller Dashboard" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarFallback>{shopProfile.shopName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{shopProfile.shopName}</h1>
              <p className="text-sm text-muted-foreground">Member since {new Date(shopProfile.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="rounded-full">
              <Link href={`/stores/${shopProfile.id}`}>
                View Store <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="sm" className="rounded-full">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="rounded-2xl border-none shadow-md">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6">
            <TabsTrigger value="products" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-4">Products</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-4">Orders</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 px-4">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="text-center py-16 bg-muted/30 rounded-[30px] border-2 border-dashed">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No products yet</h3>
              <p className="text-muted-foreground mb-6">Start your selling journey by adding your first product.</p>
              <Button className="rounded-full">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="text-center py-16 bg-muted/30 rounded-[30px] border-2 border-dashed">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No orders yet</h3>
              <p className="text-muted-foreground">Orders from your customers will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg">Shop Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <span>Edit Shop Profile</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span>Shipping Options</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
