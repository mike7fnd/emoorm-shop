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
import { regions, provinces, cities } from '@/lib/address-data';

const addressSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  phone: z.string().regex(/^(\+63|0)9\d{9}$/, 'Invalid Philippine phone number'),
  region: z.string().min(1, 'Region is required'),
  province: z.string().min(1, 'Province is required'),
  city: z.string().min(1, 'City is required'),
  zip: z.string().min(4, 'ZIP code is required').max(4),
  addressLine1: z.string().min(5, 'Address is too short'),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

type AddressFormProps = {
  address?: Partial<AddressFormValues> | null;
  onSave: (data: AddressFormValues) => void;
  onCancel: () => void;
};

export function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: address?.name || '',
      phone: address?.phone || '',
      region: address?.region || '',
      province: address?.province || '',
      city: address?.city || '',
      zip: address?.zip || '',
      addressLine1: address?.addressLine1 || '',
      isDefault: address?.isDefault || false,
    },
  });

  const selectedRegion = form.watch('region');
  const selectedProvince = form.watch('province');

  const [filteredProvinces, setFilteredProvinces] = useState(provinces.filter(p => p.region === selectedRegion));
  const [filteredCities, setFilteredCities] = useState(cities.filter(c => c.province === selectedProvince));

  useEffect(() => {
    setFilteredProvinces(provinces.filter(p => p.region === selectedRegion));
    form.setValue('province', '');
    form.setValue('city', '');
  }, [selectedRegion, form]);

  useEffect(() => {
    setFilteredCities(cities.filter(c => c.province === selectedProvince));
    form.setValue('city', '');
  }, [selectedProvince, form]);

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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region.key} value={region.key}>{region.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedRegion}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {filteredProvinces.map(province => (
                          <SelectItem key={province.key} value={province.key}>{province.name}</SelectItem>
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/Municipality</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProvince}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a city/municipality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCities.map(city => (
                          <SelectItem key={city.key} value={city.key}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street, Building, House No.</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. 123 Fashion Ave, Brgy. Central" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isDefault"
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Address</Button>
        </div>
      </form>
    </Form>
  );
}