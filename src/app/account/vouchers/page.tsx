
'use client';

import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const mockVouchers = [
  { id: '1', code: 'WINK100', description: '₱100 off on all items', expiry: '2024-08-31', minSpend: 500 },
  { id: '2', code: 'FREESHIP', description: 'Free Shipping on orders over ₱1000', expiry: '2024-08-15', minSpend: 1000 },
  { id: '3', code: 'SALE20', description: '20% off on selected items', expiry: '2024-07-31', minSpend: 0 },
];


export default function VouchersPage() {
  return (
    <AccountPageLayout title="My Vouchers">
      <div className="pt-4 md:pt-0">
        <h1 className="hidden md:block text-2xl font-bold mb-6">My Vouchers</h1>
        <div className="space-y-4">
          {mockVouchers.map(voucher => (
            <Card key={voucher.id} className="overflow-hidden">
              <div className="flex">
                <div className="bg-primary/10 flex flex-col items-center justify-center p-6 text-primary">
                  <Ticket className="w-10 h-10" />
                  <p className="font-bold mt-1 text-sm">{voucher.code}</p>
                </div>
                <div className="p-4 flex-1">
                  <p className="font-semibold">{voucher.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {voucher.minSpend > 0 ? `Min. spend ₱${voucher.minSpend}. ` : ''}
                    Valid until {new Date(voucher.expiry).toLocaleDateString()}.
                  </p>
                </div>
                <div className="flex items-center px-4">
                  <Button size="sm">Use</Button>
                </div>
              </div>
            </Card>
          ))}
          {mockVouchers.length === 0 && (
            <div className="text-center py-16 rounded-lg bg-muted/30">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-24 h-24 bg-secondary rounded-full">
                  <Ticket className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">No vouchers available</h2>
              <p className="text-muted-foreground mb-8">Check back later for new vouchers and promotions.</p>
            </div>
          )}
        </div>
      </div>
    </AccountPageLayout>
  );
}
