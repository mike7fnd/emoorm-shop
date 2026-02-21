
'use client';

import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard } from 'lucide-react';
import Image from 'next/image';

const mockCards = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '08/25' },
  { id: '2', brand: 'Mastercard', last4: '5555', expiry: '11/26' },
];


export default function PaymentPage() {
  return (
    <AccountPageLayout title="Payment Methods">
      <div className="pt-4 md:pt-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg font-semibold md:text-2xl md:font-bold">My Cards</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {mockCards.map(card => (
            <Card key={card.id} className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <p className="text-2xl font-mono tracking-widest">**** **** **** {card.last4}</p>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs opacity-70">Expires</p>
                        <p className="font-medium">{card.expiry}</p>
                      </div>
                    </div>
                  </div>
                  <Image src={`/images/${card.brand.toLowerCase()}.svg`} alt={card.brand} width={48} height={30} className="opacity-90" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {mockCards.length === 0 && (
          <div className="text-center py-16 rounded-lg bg-muted/30">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-24 h-24 bg-secondary rounded-full">
                <CreditCard className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">No saved cards</h2>
            <p className="text-muted-foreground mb-8">Add a credit or debit card for faster checkouts.</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Card
            </Button>
          </div>
        )}
      </div>
    </AccountPageLayout>
  );
}
