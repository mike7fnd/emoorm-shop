
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccountHeader } from '@/components/layout/account-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Store, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

export default function SellerRegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    shopDescription: '',
    businessAddress: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.shopName || !formData.shopDescription) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields.',
      });
      setIsLoading(false);
      return;
    }

    // Simulate registration and save to localStorage
    setTimeout(() => {
      const profile = {
        id: `shop_${Date.now()}`,
        userId: 'user_1',
        ...formData,
        rating: 5.0,
        followers: 0,
        productCount: 0,
        joinedDate: new Date().toISOString(),
      };
      localStorage.setItem('seller-profile', JSON.stringify(profile));
      
      toast({
        title: 'Registration Successful!',
        description: 'Your shop has been created. Welcome to E-Moorm!',
      });
      
      setIsLoading(false);
      router.push('/account/my-shop');
    }, 1500);
  };

  return (
    <>
      <AccountHeader title="Seller Registration" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Start Selling on E-Moorm</h1>
            <p className="text-muted-foreground">Join our community of local artisans and producers from Mindoro.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Store className="h-8 w-8 text-primary" />
                <p className="text-xs font-semibold uppercase">Your Shop</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Create a unique identity for your brand.</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <p className="text-xs font-semibold uppercase">List Products</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Reach thousands of customers instantly.</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Truck className="h-8 w-8 text-primary" />
                <p className="text-xs font-semibold uppercase">Grow Fast</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Manage orders and shipping with ease.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[30px] shadow-xl border-none">
            <CardHeader>
              <CardTitle>Shop Details</CardTitle>
              <CardDescription>Tell us about your business to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input 
                    id="shopName" 
                    name="shopName"
                    placeholder="e.g. Mangyan Heritage Crafts" 
                    required 
                    value={formData.shopName}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopDescription">Shop Description *</Label>
                  <Textarea 
                    id="shopDescription" 
                    name="shopDescription"
                    placeholder="Tell customers what makes your shop special..." 
                    required 
                    value={formData.shopDescription}
                    onChange={handleChange}
                    className="rounded-xl min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input 
                    id="businessAddress" 
                    name="businessAddress"
                    placeholder="e.g. Calapan City, Oriental Mindoro" 
                    value={formData.businessAddress}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Contact Number</Label>
                  <Input 
                    id="phoneNumber" 
                    name="phoneNumber"
                    placeholder="e.g. +63 9XX XXX XXXX" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full h-12 text-lg font-bold" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register My Shop'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
