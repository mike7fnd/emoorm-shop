'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useAllProducts, useAllStores } from '@/hooks/use-all-products';
import { ShoppingBag, X, Plus, Minus, CreditCard, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo, useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/products/product-grid';


export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { products } = useAllProducts();
  const { stores } = useAllStores();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const cartItems = useMemo(() => cart
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null), [cart]);

  useEffect(() => {
    // Initialize selected items to all items in the cart
    if (cart.length > 0) {
      setSelectedItems(cart.map(item => item.productId));
    }
  }, [cart]);


  const groupedByShop = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const shopName = item.brand;
      if (!acc[shopName]) {
        acc[shopName] = [];
      }
      acc[shopName].push(item);
      return acc;
    }, {} as Record<string, typeof cartItems>);
  }, [cartItems]);

  const selectedCartItems = useMemo(() => {
    return cartItems.filter(item => selectedItems.includes(item.id));
  }, [cartItems, selectedItems]);

  const subtotal = selectedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + shippingFee;

  const handleToggleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleToggleSelectShop = (shopItems: typeof cartItems) => {
    const shopItemIds = shopItems.map(item => item.id);
    const allSelected = shopItemIds.every(id => selectedItems.includes(id));

    if (allSelected) {
      setSelectedItems(prev => prev.filter(id => !shopItemIds.includes(id)));
    } else {
      setSelectedItems(prev => [...new Set([...prev, ...shopItemIds])]);
    }
  };

  const recommendedProducts = useMemo(() => {
    if (cartItems.length === 0) return [];

    const cartProductIds = new Set(cartItems.map(item => item.id));
    const cartCategories = new Set(cartItems.map(item => item.category));

    return products
      .filter(p => !cartProductIds.has(p.id) && cartCategories.has(p.category))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  }, [cartItems]);

  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="container mx-auto px-4 pt-4 pb-40 md:pb-8">
        <h1 className="text-lg font-semibold mb-8 md:mt-0 text-left">My Cart</h1>
        {cartItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="md:col-span-2 space-y-6">
              {Object.entries(groupedByShop).map(([shopName, items]) => {
                const store = stores.find(s => s.name === shopName);
                const shopItemIds = items.map(item => item.id);
                const allSelected = shopItemIds.every(id => selectedItems.includes(id));
                const someSelected = shopItemIds.some(id => selectedItems.includes(id));

                return (
                  <div key={shopName}>
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox
                        id={`select-shop-${shopName}`}
                        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                        onCheckedChange={() => handleToggleSelectShop(items)}
                      />
                      <Link href={store ? `/stores/${store.id}` : '#'} className="flex items-center gap-2 group">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={store?.image.src} />
                          <AvatarFallback>{shopName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-normal group-hover:underline text-sm">{shopName}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </div>
                    <Card className="rounded-[25px] shadow-card-shadow">
                      <CardContent className="p-0">
                        <div className="divide-y divide-border">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4">
                              <Checkbox
                                id={`select-item-${item.id}`}
                                className="mt-8"
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => handleToggleSelectItem(item.id)}
                              />
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
                                {item.stock < 10 && (
                                  <p className="text-sm text-destructive font-medium">
                                    Only {item.stock} left!
                                  </p>
                                )}
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
                                  <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value, 10);
                                      if (!isNaN(newQuantity) && newQuantity > 0) {
                                        updateQuantity(item.id, newQuantity);
                                      }
                                    }}
                                    className="h-6 w-12 rounded-md border text-center px-1"
                                    min="1"
                                  />
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
                );
              })}
            </div>

            <div className="hidden md:block md:col-span-1">
              <Card className="sticky top-20 shadow-card-shadow">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({selectedCartItems.length} items)</span>
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
                  <Button size="lg" className="w-full rounded-[30px]" asChild disabled={selectedCartItems.length === 0}>
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

        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <Separator />
            <h2 className="text-xl font-semibold my-8 text-center">You May Also Like</h2>
            <ProductGrid products={recommendedProducts} />
          </div>
        )}
      </main>

      {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-background border-t p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total ({selectedCartItems.length}):</span>
            <span className="text-xl font-bold">₱{total.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full rounded-[30px]" asChild disabled={selectedCartItems.length === 0}>
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
