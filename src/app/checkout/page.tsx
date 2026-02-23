'use client';

import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckoutHeader } from '@/components/layout/checkout-header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useAllProducts } from '@/hooks/use-all-products';
import { CreditCard, Truck, ShieldCheck, Banknote, MapPin, ChevronRight, Home, Plus, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useUser } from '@/supabase/provider';
import { addressService, Address } from '@/supabase/services/addresses';
import { orderService, ProductSnapshot } from '@/supabase/services/orders';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { products } = useAllProducts();
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  // Load default address from DB
  useEffect(() => {
    const loadAddress = async () => {
      if (!user?.id) {
        setIsLoadingAddress(false);
        return;
      }
      try {
        const defaultAddr = await addressService.getDefaultAddress(user.id);
        if (defaultAddr) {
          setShippingAddress(defaultAddr);
        } else {
          // No default, try getting first address
          const all = await addressService.getUserAddresses(user.id);
          if (all.length > 0) setShippingAddress(all[0]);
        }
      } catch (err) {
        console.error('Failed to load address:', err);
      } finally {
        setIsLoadingAddress(false);
      }
    };
    loadAddress();
  }, [user?.id]);

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

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      toast({ title: 'Please log in', description: 'You need to be logged in to place an order.', variant: 'destructive' });
      return;
    }

    if (!shippingAddress) {
      toast({ title: 'No address', description: 'Please add a shipping address first.', variant: 'destructive' });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Build product snapshots for order items
      const snapshots: ProductSnapshot[] = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image?.src || '',
        brand: item.brand || '',
        sellerId: item.sellerId || '',
      }));

      const { order, error } = await orderService.createOrder(
        {
          userId: user.id,
          items: cart,
          totalAmount: total,
          addressId: shippingAddress.id,
          paymentMethod,
          shippingFee,
          subtotal,
        },
        snapshots
      );

      if (error) {
        throw error;
      }

      toast({
        title: 'Order Placed!',
        description: `Order ${order.order_number || order.id} has been placed successfully.`,
      });

      clearCart();
      router.push('/account/orders/to-pay');
    } catch (err: any) {
      console.error('Failed to place order:', err);
      toast({
        title: 'Order Failed',
        description: err.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
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
                {isLoadingAddress ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : shippingAddress ? (
                  <Link href="/account/address">
                    <div className="flex items-center p-4 rounded-[15px] hover:bg-accent cursor-pointer transition-colors">
                      <MapPin className="h-8 w-8 text-primary mr-4" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{shippingAddress.name}</p>
                          {shippingAddress.is_default && (
                            <div className="text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Home className="h-3 w-3" />
                              Default
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{shippingAddress.phone}</p>
                        <p className="text-sm text-muted-foreground">{[shippingAddress.address_line_1, (shippingAddress as any).barangay, shippingAddress.city].filter(Boolean).join(', ')} {shippingAddress.zip}</p>
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
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
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
                <Button
                  size="lg"
                  className="w-full rounded-[30px]"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || !shippingAddress}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
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
