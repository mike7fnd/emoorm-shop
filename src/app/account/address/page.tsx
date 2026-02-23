'use client';

import { useState, useEffect } from 'react';
import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Loader2 } from 'lucide-react';
import { AddressCard } from '@/components/account/address-card';
import { AddressForm, AddressFormValues } from '@/components/account/address-form';
import { useUser } from '@/supabase/provider';
import { addressService, Address } from '@/supabase/services/addresses';
import { useToast } from '@/hooks/use-toast';

export default function AddressPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadAddresses = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await addressService.getUserAddresses(user.id);
      setAddresses(data);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [user?.id]);

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleSave = async (data: AddressFormValues) => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      if (editingAddress) {
        // Update existing
        const updated = await addressService.updateAddress(editingAddress.id, user.id, {
          name: data.name,
          phone: data.phone,
          address_line_1: data.address_line_1,
          barangay: data.barangay,
          city: data.city,
          province: data.province,
          region: data.region,
          zip: data.zip,
          is_default: data.is_default,
        });
        if (updated) {
          toast({ title: 'Address Updated', description: 'Your address has been updated.' });
        } else {
          toast({ title: 'Error', description: 'Failed to update address.', variant: 'destructive' });
        }
      } else {
        // Create new
        const created = await addressService.createAddress(user.id, {
          name: data.name,
          phone: data.phone,
          address_line_1: data.address_line_1,
          barangay: data.barangay,
          city: data.city,
          province: data.province,
          region: data.region,
          zip: data.zip,
          is_default: data.is_default,
        });
        if (created) {
          toast({ title: 'Address Added', description: 'New address has been saved.' });
        } else {
          toast({ title: 'Error', description: 'Failed to create address.', variant: 'destructive' });
        }
      }

      await loadAddresses();
      setIsFormOpen(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Save address error:', err);
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    const success = await addressService.deleteAddress(id, user.id);
    if (success) {
      toast({ title: 'Address Deleted' });
      await loadAddresses();
    } else {
      toast({ title: 'Error', description: 'Failed to delete address.', variant: 'destructive' });
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user?.id) return;
    const success = await addressService.setDefault(id, user.id);
    if (success) {
      toast({ title: 'Default Updated', description: 'Default address has been changed.' });
      await loadAddresses();
    } else {
      toast({ title: 'Error', description: 'Failed to set default.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <AccountPageLayout title="My Addresses">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AccountPageLayout>
    );
  }

  return (
    <AccountPageLayout title="My Addresses">
      <div className="pt-4 md:pt-0">
        {!isFormOpen ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-lg font-semibold md:text-2xl md:font-bold">My Addresses</h1>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>
            {addresses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() => handleEdit(address)}
                    onDelete={() => handleDelete(address.id)}
                    onSetDefault={() => handleSetDefault(address.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-lg bg-muted/30">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-24 h-24 bg-secondary rounded-full">
                    <MapPin className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-2">No saved addresses</h2>
                <p className="text-muted-foreground mb-8">Add a new address to get started with faster checkouts.</p>
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Address
                </Button>
              </div>
            )}
          </>
        ) : (
          <div>
            <h1 className="text-lg font-semibold mb-8 md:text-2xl md:font-bold">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h1>
            <AddressForm
              address={editingAddress}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={isSaving}
            />
          </div>
        )}
      </div>
    </AccountPageLayout>
  );
}
