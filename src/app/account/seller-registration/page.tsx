
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/supabase/provider';
import { useAuthSheet } from '@/components/auth/auth-bottom-sheet';
import { getSupabaseClient } from '@/supabase/client';
import { Store, ShoppingBag, Truck, ArrowRight, X } from 'lucide-react';
import { phAddressApi, type PsgcCityMunicipality, type PsgcBarangay } from '@/lib/ph-address-api';

// PSGC codes for MIMAROPA → Oriental Mindoro
const MIMAROPA_REGION_CODE = '170000000';
const ORIENTAL_MINDORO_CODE = '175200000';

export default function SellerRegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const { openAuthSheet } = useAuthSheet();
  const supabase = getSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [formData, setFormData] = useState({
    shopName: '',
    shopDescription: '',
    municipality: '',
    barangay: '',
    streetAddress: '',
    phoneNumber: '',
  });

  // PH Address API state — pre-loaded for Oriental Mindoro
  const [municipalities, setMunicipalities] = useState<PsgcCityMunicipality[]>([]);
  const [barangays, setBarangays] = useState<PsgcBarangay[]>([]);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(true);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [selectedMunicipalityCode, setSelectedMunicipalityCode] = useState('');

  // Load municipalities for Oriental Mindoro on mount
  useEffect(() => {
    phAddressApi.getCitiesMunicipalities(ORIENTAL_MINDORO_CODE).then((data) => {
      setMunicipalities(data);
      setLoadingMunicipalities(false);
    }).catch(() => setLoadingMunicipalities(false));
  }, []);

  // When municipality changes, load barangays
  useEffect(() => {
    if (!selectedMunicipalityCode) {
      setBarangays([]);
      return;
    }
    setLoadingBarangays(true);
    phAddressApi.getBarangays(selectedMunicipalityCode).then((data) => {
      setBarangays(data);
      setLoadingBarangays(false);
    }).catch(() => setLoadingBarangays(false));
  }, [selectedMunicipalityCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits after +63
    const raw = e.target.value.replace(/[^\d]/g, '');
    // Limit to 10 digits (the part after +63)
    setFormData((prev) => ({ ...prev, phoneNumber: raw.slice(0, 10) }));
  };

  const handleMunicipalityChange = (value: string) => {
    const muni = municipalities.find(m => m.name === value);
    setSelectedMunicipalityCode(muni?.code || '');
    setFormData(prev => ({ ...prev, municipality: value, barangay: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!user?.id) {
      openAuthSheet('login');
      setIsLoading(false);
      return;
    }

    // Build full address string
    const addressParts = [
      formData.streetAddress,
      formData.barangay,
      formData.municipality,
      'Oriental Mindoro',
      'MIMAROPA',
    ].filter(Boolean);
    const fullAddress = addressParts.join(', ');
    const fullPhone = formData.phoneNumber ? `+63${formData.phoneNumber}` : '';

    try {
      // Save seller profile to Supabase
      const { data, error } = await supabase
        .from('seller_profiles')
        .insert({
          user_id: user.id,
          shop_name: formData.shopName,
          shop_description: formData.shopDescription,
          address: fullAddress,
          region: MIMAROPA_REGION_CODE,
          state: ORIENTAL_MINDORO_CODE,
          city: formData.municipality,
          contact_phone: fullPhone,
          is_verified: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Registration Successful!',
        description: 'Your shop has been created. Welcome to E-Moorm!',
      });

      setIsLoading(false);
      router.push('/account/my-shop');
    } catch (error: any) {
      console.error('Failed to register seller:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'Failed to register your shop. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <AccountPageLayout title="Seller Registration">
      {/* Floating Intro Overlay */}
      {showIntro && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setShowIntro(false)}
        >
          <div
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative w-full max-w-xs animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          >
              <Card className="rounded-[28px] border-0 shadow-2xl overflow-hidden">
                <div className="relative flex justify-center pt-5">
                  <button
                    onClick={() => setShowIntro(false)}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img
                    src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-KUWgwrso9NLrJCd8v2zEoMKerMWAwV.png&w=500&q=75"
                    alt="Start selling"
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <CardContent className="p-5 space-y-4 text-center">
                  <div>
                    <h2 className="text-lg font-bold">Start Selling on E-Moorm</h2>
                    <p className="text-xs text-muted-foreground mt-1">Showcase your local products from Mindoro and reach more customers.</p>
                  </div>
                  <Button
                    onClick={() => setShowIntro(false)}
                    className="w-full rounded-full h-11 text-sm font-bold gap-2"
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      <div className="pt-4 md:pt-0">
        <div className="max-w-2xl mx-auto md:mx-0 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Start Selling on E-Moorm</h1>
            <p className="text-muted-foreground">Join our community of local artisans and producers from Mindoro.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-primary/5">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Store className="h-8 w-8 text-primary" />
                <p className="text-xs font-semibold uppercase">Your Shop</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Create a unique identity for your brand.</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <p className="text-xs font-semibold uppercase">List Products</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Reach thousands of customers instantly.</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <Truck className="h-8 w-8 text-primary" />
                <p className="text-xs font-semibold uppercase">Grow Fast</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Manage orders and shipping with ease.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[30px]">
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
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Business Address</Label>
                  <p className="text-xs text-muted-foreground">MIMAROPA — Oriental Mindoro</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Municipality *</Label>
                      <Select value={formData.municipality} onValueChange={handleMunicipalityChange}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder={loadingMunicipalities ? 'Loading...' : 'Select municipality'} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {municipalities.map(m => (
                            <SelectItem key={m.code} value={m.name}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Barangay</Label>
                      <Select value={formData.barangay} onValueChange={(val) => setFormData(prev => ({ ...prev, barangay: val }))} disabled={!selectedMunicipalityCode || loadingBarangays}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder={loadingBarangays ? 'Loading...' : 'Select barangay'} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {barangays.map(b => (
                            <SelectItem key={b.code} value={b.name}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street / Building / House No.</Label>
                    <Input
                      id="streetAddress"
                      name="streetAddress"
                      placeholder="e.g. 123 Rizal St."
                      value={formData.streetAddress}
                      onChange={handleChange}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Contact Number</Label>
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 items-center rounded-xl border bg-muted px-3 text-sm font-medium text-muted-foreground select-none">+63</span>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="9XX XXX XXXX"
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      className="rounded-xl"
                      type="tel"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-full h-12 text-lg font-bold" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register My Shop'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccountPageLayout>
  );
}
