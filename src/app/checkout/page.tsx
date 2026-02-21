'use client';

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckoutHeader } from '@/components/layout/checkout-header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useAllProducts } from '@/hooks/use-all-products';
import { CreditCard, Truck, ShieldCheck, Banknote, MapPin, ChevronRight, Home, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// Mock address data
const mockAddress = {
  id: '1',
  name: 'John Doe',
  phone: '+63 912 345 6789',
  addressLine1: '123 Fashion Ave',
  city: 'Quezon City',
  state: 'Metro Manila',
  zip: '1101',
  isDefault: true,
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { products } = useAllProducts();
  const { toast } = useToast();
  const [shippingAddress, setShippingAddress] = useState(mockAddress);


  const cartItems = cart
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  useEffect(() => {
    if (cartItems.length === 0) {
      redirect('/cart');
    }
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 50;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase.",
    });
    clearCart();
    // In a real app, you'd redirect to an order confirmation page
  };

  if (cartItems.length === 0) {
    return null; // or a loading spinner, while redirecting
  }

  return (
    <>
      <CheckoutHeader />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
          <div className="md:col-span-3 space-y-8">
            <Card>
              <CardHeader>
                <div className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </div>
              </CardHeader>
              <CardContent>
                {shippingAddress ? (
                  <Link href="/account/address">
                    <div className="flex items-center p-4 rounded-[15px] hover:bg-accent cursor-pointer transition-colors">
                      <MapPin className="h-8 w-8 text-primary mr-4" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{shippingAddress.name}</p>
                          {shippingAddress.isDefault && (
                            <div className="text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Home className="h-3 w-3" />
                              Default
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{shippingAddress.phone}</p>
                        <p className="text-sm text-muted-foreground">{`${shippingAddress.addressLine1}, ${shippingAddress.city}, ${shippingAddress.zip}`}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                ) : (
                  <Link href="/account/address">
                    <div className="flex flex-col items-center justify-center p-8 rounded-[15px] hover:bg-accent cursor-pointer transition-colors">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="font-semibold text-primary">Add a new address</p>
                      <p className="text-sm text-muted-foreground">You have no saved addresses.</p>
                    </div>
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card">
                  <Label htmlFor="card">
                    <div className="flex items-center space-x-2 p-4 rounded-md cursor-pointer has-[:checked]:bg-accent">
                      <RadioGroupItem value="card" id="card" />
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <span>Credit / Debit Card</span>
                      </div>
                    </div>
                  </Label>
                  <Label htmlFor="cod" className="mt-4 block">
                    <div className="flex items-center space-x-2 p-4 rounded-md cursor-pointer has-[:checked]:bg-accent">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex items-center gap-3">
                        <Banknote className="h-5 w-5 text-primary" />
                        <span>Cash on Delivery</span>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          src={item.image.src}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-[15px] object-cover aspect-square"
                          data-ai-hint={item.image.hint}
                        />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-muted-foreground text-xs">{item.brand}</p>
                      </div>
                      <p className="font-semibold text-sm">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₱{shippingFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full rounded-[30px]" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
