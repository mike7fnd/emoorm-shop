'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/lib/data';
import { ShoppingBag, X, Plus, Minus, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const cartItems = cart
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + shippingFee;

  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="container mx-auto px-4 pt-4 pb-40 md:pb-8">
        <h1 className="text-lg font-semibold mb-8 md:mt-0 text-center md:text-left">My Cart</h1>
        {cartItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4">
                        <Image
                          src={item.image.src}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-[15px] object-cover aspect-square"
                          data-ai-hint={item.image.hint}
                        />
                        <div className="flex-1">
                          <Link href={`/products/${item.id}`} className="font-semibold hover:underline">
                            {item.name}
                          </Link>
                          <p className="text-muted-foreground text-sm">₱{item.price.toFixed(2)}</p>
                           <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground mt-2"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="hidden md:block md:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
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
                   <Button size="lg" className="w-full rounded-[30px]" asChild>
                    <Link href="/checkout">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-24 h-24 bg-secondary rounded-full">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven’t added any items to your cart yet.</p>
            <Button asChild className="rounded-[30px]">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </main>

       {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-background border-t p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-xl font-bold">₱{total.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full rounded-[30px]" asChild>
            <Link href="/checkout">
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
