'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { phAddressApi, type PsgcRegion, type PsgcProvince, type PsgcCityMunicipality, type PsgcBarangay } from '@/lib/ph-address-api';
import { Loader2 } from 'lucide-react';

const addressSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  phone: z.string().regex(/^(\+63|0)9\d{9}$/, 'Invalid Philippine phone number'),
  region: z.string().min(1, 'Region is required'),
  province: z.string().min(1, 'Province is required'),
  city: z.string().min(1, 'City/Municipality is required'),
  barangay: z.string().min(1, 'Barangay is required'),
  zip: z.string().min(4, 'ZIP code is required').max(4),
  address_line_1: z.string().min(5, 'Address is too short'),
  is_default: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

type AddressFormProps = {
  address?: Partial<AddressFormValues> | null;
  onSave: (data: AddressFormValues) => void | Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
};

export function AddressForm({ address, onSave, onCancel, isSaving }: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: address?.name || '',
      phone: address?.phone || '',
      region: address?.region || '',
      province: address?.province || '',
      city: address?.city || '',
      barangay: address?.barangay || '',
      zip: address?.zip || '',
      address_line_1: address?.address_line_1 || '',
      is_default: address?.is_default || false,
    },
  });

  const selectedRegion = form.watch('region');
  const selectedProvince = form.watch('province');
  const selectedCity = form.watch('city');

  // API-loaded options
  const [regions, setRegions] = useState<PsgcRegion[]>([]);
  const [provinces, setProvinces] = useState<PsgcProvince[]>([]);
  const [citiesMunicipalities, setCitiesMunicipalities] = useState<PsgcCityMunicipality[]>([]);
  const [barangays, setBarangays] = useState<PsgcBarangay[]>([]);

  // Loading states
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  // Whether the selected region is NCR (no provinces)
  const [isNCR, setIsNCR] = useState(false);

  // Track if initial values have been restored (for edit mode)
  const [initialRestored, setInitialRestored] = useState(false);

  // Load all regions on mount
  useEffect(() => {
    phAddressApi.getRegions().then((data) => {
      setRegions(data);
      setLoadingRegions(false);
    }).catch(() => setLoadingRegions(false));
  }, []);

  // When region changes, load provinces (or cities for NCR)
  useEffect(() => {
    if (!selectedRegion) {
      setProvinces([]);
      setCitiesMunicipalities([]);
      setBarangays([]);
      return;
    }

    const isNcrRegion = phAddressApi.isNCR(selectedRegion);
    setIsNCR(isNcrRegion);

    if (isNcrRegion) {
      // NCR has no provinces — load cities directly
      setProvinces([]);
      setLoadingCities(true);
      if (!initialRestored || !address?.region) {
        form.setValue('province', 'NCR');
        form.setValue('city', '');
        form.setValue('barangay', '');
      }
      phAddressApi.getCitiesMunicipalitiesByRegion(selectedRegion).then((data) => {
        setCitiesMunicipalities(data);
        setLoadingCities(false);
      }).catch(() => setLoadingCities(false));
    } else {
      setLoadingProvinces(true);
      if (!initialRestored || !address?.region) {
        form.setValue('province', '');
        form.setValue('city', '');
        form.setValue('barangay', '');
      }
      setCitiesMunicipalities([]);
      setBarangays([]);
      phAddressApi.getProvinces(selectedRegion).then((data) => {
        setProvinces(data);
        setLoadingProvinces(false);
      }).catch(() => setLoadingProvinces(false));
    }
  }, [selectedRegion]);

  // When province changes, load cities/municipalities
  useEffect(() => {
    if (!selectedProvince || isNCR) {
      if (!isNCR) {
        setCitiesMunicipalities([]);
        setBarangays([]);
      }
      return;
    }

    setLoadingCities(true);
    if (!initialRestored || !address?.province) {
      form.setValue('city', '');
      form.setValue('barangay', '');
    }
    setBarangays([]);

    phAddressApi.getCitiesMunicipalities(selectedProvince).then((data) => {
      setCitiesMunicipalities(data);
      setLoadingCities(false);
    }).catch(() => setLoadingCities(false));
  }, [selectedProvince, isNCR]);

  // When city changes, load barangays
  useEffect(() => {
    if (!selectedCity) {
      setBarangays([]);
      return;
    }

    setLoadingBarangays(true);
    if (!initialRestored || !address?.city) {
      form.setValue('barangay', '');
    }

    phAddressApi.getBarangays(selectedCity).then((data) => {
      setBarangays(data);
      setLoadingBarangays(false);
      // Mark initial restore as done after first full cascade
      if (!initialRestored) setInitialRestored(true);
    }).catch(() => {
      setLoadingBarangays(false);
      if (!initialRestored) setInitialRestored(true);
    });
  }, [selectedCity]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+63 912 345 6789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingRegions}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingRegions ? 'Loading regions...' : 'Select a region'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region.code} value={region.code}>
                            {region.name} ({region.regionName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isNCR && (
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedRegion || loadingProvinces}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingProvinces ? 'Loading...' : 'Select a province'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces.map(province => (
                            <SelectItem key={province.code} value={province.code}>{province.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/Municipality</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={(!selectedProvince && !isNCR) || loadingCities}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCities ? 'Loading...' : 'Select a city/municipality'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {citiesMunicipalities.map(city => (
                          <SelectItem key={city.code} value={city.code}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barangay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barangay</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCity || loadingBarangays}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingBarangays ? 'Loading...' : 'Select a barangay'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {barangays.map(brgy => (
                          <SelectItem key={brgy.code} value={brgy.name}>{brgy.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="1101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street, Building, House No.</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. 123 Fashion Ave, Blk 5 Lot 8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Set as default shipping address
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving} className="bg-muted text-muted-foreground shadow-none hover:bg-muted/80">
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Address'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
