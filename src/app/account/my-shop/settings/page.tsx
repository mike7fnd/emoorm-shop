'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SellerPageLayout } from '@/components/layout/seller-page-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, MapPin, Plus, X, Camera, Tag, Loader2 as Loader2Icon, ZoomOut, ZoomIn, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/supabase/provider';
import { sellerService } from '@/supabase/services/seller';
import { storeService, StorePhoto } from '@/supabase/services/stores';
import { getSupabaseClient } from '@/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { phAddressApi, type PsgcRegion, type PsgcProvince, type PsgcCityMunicipality } from '@/lib/ph-address-api';
import { storageService } from '@/supabase/services/storage';
import { ImageUpload } from '@/components/ui/image-upload';

const LocationPickerMap = dynamic(() => import('@/components/map/location-picker-map'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />,
});

const GENRE_OPTIONS = [
  { icon: 'Carrot', text: 'Fresh Produce' },
  { icon: 'Grape', text: 'Fruits' },
  { icon: 'Sprout', text: 'Organic' },
  { icon: 'Carrot', text: 'Vegetables' },
  { icon: 'ShoppingBasket', text: 'Pantry Staples' },
  { icon: 'Cake', text: 'Delicacies' },
  { icon: 'Gift', text: 'Souvenirs' },
  { icon: 'Candy', text: 'Sweets' },
  { icon: 'Paintbrush', text: 'Handmade' },
  { icon: 'ShoppingBag', text: 'Crafts' },
  { icon: 'Gem', text: 'Artisanal' },
  { icon: 'Heart', text: 'Healthy' },
  { icon: 'Leaf', text: 'Natural' },
  { icon: 'CupSoda', text: 'Beverages' },
  { icon: 'Shirt', text: 'Fashion' },
  { icon: 'Home', text: 'Home Decor' },
  { icon: 'Sparkles', text: 'Wellness' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const supabase = getSupabaseClient();
  
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [storePhotos, setStorePhotos] = useState<StorePhoto[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<{ icon: string; text: string }[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoZoom, setPhotoZoom] = useState(100);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    shopName: '',
    shopDescription: '',
    about: '',
    shopLogo: '',
    shopBanner: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    region: '',
    province: '',
    city: '',
    zipCode: '',
  });

  // PSGC API state for address dropdowns
  const [phRegions, setPhRegions] = useState<PsgcRegion[]>([]);
  const [phProvinces, setPhProvinces] = useState<PsgcProvince[]>([]);
  const [phCities, setPhCities] = useState<PsgcCityMunicipality[]>([]);
  const [loadingPhRegions, setLoadingPhRegions] = useState(true);
  const [loadingPhProvinces, setLoadingPhProvinces] = useState(false);
  const [loadingPhCities, setLoadingPhCities] = useState(false);
  const [isNcrShop, setIsNcrShop] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await sellerService.getSellerProfile(user.id);
        if (profile) {
          setSellerProfile(profile);
          setFormData({
            shopName: profile.shop_name || '',
            shopDescription: profile.shop_description || '',
            about: (profile as any).about || profile.shop_description || '',
            shopLogo: profile.shop_logo || '',
            shopBanner: profile.shop_banner || '',
            contactEmail: profile.contact_email || '',
            contactPhone: profile.contact_phone || '',
            address: profile.address || '',
            region: (profile as any).region || '',
            province: profile.state || '',
            city: profile.city || '',
            zipCode: profile.zip_code || '',
          });
          setLocation((profile as any).lat && (profile as any).lng ? { lat: (profile as any).lat, lng: (profile as any).lng } : null);

          // Load photos and genres
          const [photos, genres] = await Promise.all([
            storeService.getStorePhotos(profile.id),
            storeService.getStoreGenres(profile.id),
          ]);
          setStorePhotos(photos);
          setSelectedGenres(genres.map(g => ({ icon: g.icon, text: g.text })));
        }
      } catch (err) {
        console.error('Failed to load seller profile:', err);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load seller profile.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  // Load PH regions on mount
  useEffect(() => {
    phAddressApi.getRegions().then((data) => {
      setPhRegions(data);
      setLoadingPhRegions(false);
    }).catch(() => setLoadingPhRegions(false));
  }, []);

  // When region changes, load provinces or cities (NCR)
  useEffect(() => {
    if (!formData.region) return;
    const isNcr = phAddressApi.isNCR(formData.region);
    setIsNcrShop(isNcr);

    if (isNcr) {
      setPhProvinces([]);
      setLoadingPhCities(true);
      phAddressApi.getCitiesMunicipalitiesByRegion(formData.region).then((data) => {
        setPhCities(data);
        setLoadingPhCities(false);
      }).catch(() => setLoadingPhCities(false));
    } else {
      setLoadingPhProvinces(true);
      setPhCities([]);
      phAddressApi.getProvinces(formData.region).then((data) => {
        setPhProvinces(data);
        setLoadingPhProvinces(false);
      }).catch(() => setLoadingPhProvinces(false));
    }
  }, [formData.region]);

  // When province changes, load cities
  useEffect(() => {
    if (!formData.province || isNcrShop) return;
    setLoadingPhCities(true);
    phAddressApi.getCitiesMunicipalities(formData.province).then((data) => {
      setPhCities(data);
      setLoadingPhCities(false);
    }).catch(() => setLoadingPhCities(false));
  }, [formData.province, isNcrShop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('seller_profiles')
        .update({
          shop_name: formData.shopName,
          shop_description: formData.shopDescription,
          about: formData.about,
          shop_logo: formData.shopLogo,
          shop_banner: formData.shopBanner,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          address: formData.address,
          region: formData.region,
          city: formData.city,
          state: formData.province,
          zip_code: formData.zipCode,
          country: 'Philippines',
          lat: location?.lat || null,
          lng: location?.lng || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      // Save genres
      if (sellerProfile) {
        await storeService.setStoreGenres(sellerProfile.id, selectedGenres);
      }

      toast({ title: 'Success', description: 'Shop settings updated successfully.' });
    } catch (error: any) {
      console.error('Failed to update shop settings:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to update shop settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const addPhoto = async () => {
    if (!photoUrl || !sellerProfile) return;
    const photo = await storeService.addStorePhoto(sellerProfile.id, photoUrl, photoCaption || undefined);
    if (photo) {
      setStorePhotos(prev => [...prev, photo]);
      setPhotoUrl('');
      setPhotoCaption('');
      setPhotoZoom(100);
      setIsPhotoDialogOpen(false);
      toast({ title: 'Photo added' });
    } else {
      toast({ variant: 'destructive', title: 'Failed to add photo' });
    }
  };

  const removePhoto = async (photoId: string) => {
    const success = await storeService.removeStorePhoto(photoId);
    if (success) {
      setStorePhotos(prev => prev.filter(p => p.id !== photoId));
      toast({ title: 'Photo removed' });
    }
  };

  const toggleGenre = (genre: { icon: string; text: string }) => {
    setSelectedGenres(prev => {
      const exists = prev.find(g => g.text === genre.text);
      if (exists) return prev.filter(g => g.text !== genre.text);
      if (prev.length >= 5) {
        toast({ variant: 'destructive', title: 'Max 5 badges', description: 'Remove one before adding another.' });
        return prev;
      }
      return [...prev, genre];
    });
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!sellerProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <Settings className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold">No Shop Found</h1>
        <p className="text-muted-foreground">Please register as a seller first.</p>
      </div>
    );
  }

  return (
    <SellerPageLayout title="Shop Settings">
      <div className="pt-4 md:pt-0 space-y-6">
        {/* Basic Info Card */}
        <Card className="rounded-[30px]">
          <CardHeader>
            <CardTitle>Edit Shop Details</CardTitle>
            <CardDescription>Update your shop information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input id="shopName" name="shopName" value={formData.shopName} onChange={handleChange} className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopDescription">Short Description</Label>
                <Input id="shopDescription" name="shopDescription" value={formData.shopDescription} onChange={handleChange} className="rounded-xl" placeholder="One-line description of your shop" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About Your Store</Label>
                <Textarea id="about" name="about" value={formData.about} onChange={handleChange} className="rounded-xl" rows={4} placeholder="Tell buyers about your store, what you sell, your story..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUpload
                  label="Shop Logo"
                  value={formData.shopLogo}
                  isUploading={isUploadingLogo}
                  shape="circle"
                  maxSizeMB={3}
                  onFileSelected={async (file) => {
                    if (!sellerProfile) return;
                    setIsUploadingLogo(true);
                    try {
                      const url = await storageService.uploadStoreImage(sellerProfile.id, file);
                      if (url) {
                        setFormData(prev => ({ ...prev, shopLogo: url }));
                      } else {
                        toast({ variant: 'destructive', title: 'Upload failed' });
                      }
                    } catch (err) {
                      console.error('Logo upload error:', err);
                    } finally {
                      setIsUploadingLogo(false);
                    }
                  }}
                  onClear={() => setFormData(prev => ({ ...prev, shopLogo: '' }))}
                />
                <ImageUpload
                  label="Shop Banner"
                  value={formData.shopBanner}
                  isUploading={isUploadingBanner}
                  shape="banner"
                  maxSizeMB={5}
                  onFileSelected={async (file) => {
                    if (!sellerProfile) return;
                    setIsUploadingBanner(true);
                    try {
                      const url = await storageService.uploadStoreImage(sellerProfile.id, file);
                      if (url) {
                        setFormData(prev => ({ ...prev, shopBanner: url }));
                      } else {
                        toast({ variant: 'destructive', title: 'Upload failed' });
                      }
                    } catch (err) {
                      console.error('Banner upload error:', err);
                    } finally {
                      setIsUploadingBanner(false);
                    }
                  }}
                  onClear={() => setFormData(prev => ({ ...prev, shopBanner: '' }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} className="rounded-xl" placeholder="Street, Building, House No." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={formData.region} onValueChange={(val) => setFormData(prev => ({ ...prev, region: val, province: '', city: '' }))}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={loadingPhRegions ? 'Loading...' : 'Select region'} />
                    </SelectTrigger>
                    <SelectContent>
                      {phRegions.map(r => (
                        <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {!isNcrShop && (
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <Select value={formData.province} onValueChange={(val) => setFormData(prev => ({ ...prev, province: val, city: '' }))} disabled={!formData.region || loadingPhProvinces}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder={loadingPhProvinces ? 'Loading...' : 'Select province'} />
                      </SelectTrigger>
                      <SelectContent>
                        {phProvinces.map(p => (
                          <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City/Municipality</Label>
                  <Select value={formData.city} onValueChange={(val) => setFormData(prev => ({ ...prev, city: val }))} disabled={(!formData.province && !isNcrShop) || loadingPhCities}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={loadingPhCities ? 'Loading...' : 'Select city'} />
                    </SelectTrigger>
                    <SelectContent>
                      {phCities.map(c => (
                        <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} className="rounded-xl" />
                </div>
              </div>

              <Separator />

              {/* Store Badges/Genres */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold flex items-center gap-2"><Tag className="h-4 w-4" /> Store Badges</Label>
                  <p className="text-sm text-muted-foreground mt-1">Select up to 5 badges that describe what you sell</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => {
                    const isSelected = selectedGenres.some(g => g.text === genre.text);
                    return (
                      <Badge
                        key={genre.text}
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer py-1.5 px-3 text-sm"
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre.text}
                        {isSelected && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Location Picker */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Pin Your Store Location</Label>
                  <p className="text-sm text-muted-foreground mt-1">Click on the map to set your store&apos;s location</p>
                </div>
                <LocationPickerMap
                  lat={location?.lat || 13.4121}
                  lng={location?.lng || 121.1764}
                  onLocationChange={handleLocationChange}
                />
                {location && (
                  <p className="text-xs text-muted-foreground">
                    Location set: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSaving} className="rounded-full">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.back()} className="rounded-full bg-muted text-muted-foreground shadow-none hover:bg-muted/80">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Store Photos Card */}
        <Card className="rounded-[30px]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" /> Store Photos</CardTitle>
                <CardDescription>Add photos to showcase your store</CardDescription>
              </div>
              <Button size="sm" className="rounded-full" onClick={() => setIsPhotoDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Photo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {storePhotos.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-xl">
                <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No photos yet. Add some to attract buyers!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {storePhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
                    <Image src={photo.photo_url} alt="Store photo" fill className="object-cover" sizes="200px" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Photo Dialog */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={(open) => {
          setIsPhotoDialogOpen(open);
          if (!open) { setPhotoUrl(''); setPhotoCaption(''); setPhotoZoom(100); }
        }}>
          <DialogContent className="rounded-[30px] max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Store Photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              {/* Upload area */}
              <ImageUpload
                value={photoUrl}
                isUploading={isUploadingPhoto}
                shape="square"
                maxSizeMB={5}
                onFileSelected={async (file) => {
                  if (!sellerProfile) return;
                  setIsUploadingPhoto(true);
                  try {
                    const url = await storageService.uploadStoreImage(sellerProfile.id, file);
                    if (url) {
                      setPhotoUrl(url);
                    } else {
                      toast({ variant: 'destructive', title: 'Upload failed' });
                    }
                  } catch (err) {
                    console.error('Store photo upload error:', err);
                  } finally {
                    setIsUploadingPhoto(false);
                  }
                }}
                onClear={() => { setPhotoUrl(''); setPhotoZoom(100); }}
              />

              {/* Zoom control — visible after upload */}
              {photoUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Adjust Zoom</Label>
                    <span className="text-xs text-muted-foreground">{photoZoom}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Slider
                      value={[photoZoom]}
                      onValueChange={([v]) => setPhotoZoom(v)}
                      min={50}
                      max={150}
                      step={5}
                      className="flex-1"
                    />
                    <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </div>
              )}

              {/* Caption / description */}
              <div className="space-y-2">
                <Label htmlFor="photoCaption" className="text-sm font-medium">Caption (optional)</Label>
                <Input
                  id="photoCaption"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="e.g. Our fresh harvest display"
                  className="rounded-xl"
                  maxLength={120}
                />
                <p className="text-[11px] text-muted-foreground">{photoCaption.length}/120 — shown to buyers below the photo</p>
              </div>

              {/* Buyer preview */}
              {photoUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    Buyer Preview
                  </div>
                  <div className="border rounded-2xl overflow-hidden bg-muted">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={photoUrl}
                        alt="Buyer preview"
                        className="w-full h-full object-cover transition-transform duration-200"
                        style={{ transform: `scale(${photoZoom / 100})` }}
                      />
                    </div>
                    {photoCaption && (
                      <div className="px-3 py-2 bg-white">
                        <p className="text-sm text-foreground line-clamp-2">{photoCaption}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={addPhoto} className="rounded-full flex-grow" disabled={!photoUrl || isUploadingPhoto}>Add Photo</Button>
                <Button variant="ghost" onClick={() => { setIsPhotoDialogOpen(false); setPhotoUrl(''); setPhotoCaption(''); setPhotoZoom(100); }} className="rounded-full bg-muted text-muted-foreground shadow-none hover:bg-muted/80">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SellerPageLayout>
  );
}
