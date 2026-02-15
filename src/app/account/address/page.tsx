'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { AddressCard } from '@/components/account/address-card';
import { AddressForm } from '@/components/account/address-form';

const mockAddresses = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+63 912 345 6789',
    addressLine1: '123 Fashion Ave, Brgy. Central',
    city: 'Quezon City',
    province: 'Metro Manila',
    region: 'NCR',
    zip: '1101',
    isDefault: true,
  },
  {
    id: '2',
    name: 'John Doe',
    phone: '+63 998 765 4321',
    addressLine1: '456 Style St, Brgy. Lahug',
    city: 'Cebu City',
    province: 'Cebu',
    region: 'VII',
    zip: '6000',
    isDefault: false,
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleSave = (address: any) => {
    if (address.id) {
      setAddresses(addresses.map(a => a.id === address.id ? address : a));
    } else {
      setAddresses([...addresses, { ...address, id: `${Date.now()}` }]);
    }
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

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
            />
          </div>
        )}
      </div>
    </AccountPageLayout>
  );
}
