'use client';

import { useState, useEffect } from 'react';
import { SellerPageLayout } from '@/components/layout/seller-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/supabase/provider';
import { sellerService, SellerProfile } from '@/supabase/services/seller';
import { productService, DbProduct } from '@/supabase/services/products';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

const CATEGORIES = [
  'Fresh Produce', 'Local Delicacies', 'Handicrafts', 'Pantry Staples',
  'Wellness & Herbs', 'Home Decor', 'Beverages', 'Native Fashion',
];

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
  stock: string;
  on_sale: boolean;
  is_auction: boolean;
  current_bid: string;
  bid_end_time: string;
}

const emptyForm: ProductFormData = {
  name: '', description: '', price: '', image_url: '', category: '',
  stock: '0', on_sale: false, is_auction: false, current_bid: '', bid_end_time: '',
};

export default function ProductsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  const loadData = async () => {
    if (!user?.id) { setIsLoading(false); return; }
    try {
      const profile = await sellerService.getSellerProfile(user.id);
      setSellerProfile(profile);
      if (profile) {
        const prods = await productService.getAllProductsBySeller(profile.id);
        setProducts(prods);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, [user?.id]);

  const openAddDialog = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: DbProduct) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      category: product.category || '',
      stock: product.stock.toString(),
      on_sale: product.on_sale,
      is_auction: product.is_auction,
      current_bid: product.current_bid?.toString() || '',
      bid_end_time: product.bid_end_time ? new Date(product.bid_end_time).toISOString().slice(0, 16) : '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerProfile) return;

    if (!form.name || !form.price || !form.category) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Name, price, and category are required.' });
      return;
    }

    setIsSaving(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          image_url: form.image_url,
          category: form.category,
          stock: parseInt(form.stock) || 0,
          on_sale: form.on_sale,
          is_auction: form.is_auction,
          current_bid: form.is_auction ? parseFloat(form.current_bid) || null : null,
          bid_end_time: form.is_auction && form.bid_end_time ? new Date(form.bid_end_time).toISOString() : null,
        });
        toast({ title: 'Product updated', description: `${form.name} has been updated.` });
      } else {
        await productService.createProduct({
          seller_id: sellerProfile.id,
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          image_url: form.image_url,
          category: form.category,
          stock: parseInt(form.stock) || 0,
          on_sale: form.on_sale,
          is_auction: form.is_auction,
          current_bid: form.is_auction ? parseFloat(form.current_bid) || undefined : undefined,
          bid_end_time: form.is_auction && form.bid_end_time ? new Date(form.bid_end_time).toISOString() : undefined,
        });
        toast({ title: 'Product added!', description: `${form.name} is now listed in your shop.` });
      }
      setIsDialogOpen(false);
      setForm(emptyForm);
      await loadData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to save product.' });
    } finally { setIsSaving(false); }
  };

  const handleDelete = async (product: DbProduct) => {
    if (!confirm(`Delete "${product.name}"? This will hide it from buyers.`)) return;
    const success = await productService.deleteProduct(product.id);
    if (success) {
      toast({ title: 'Product removed', description: `${product.name} has been removed.` });
      await loadData();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete product.' });
    }
  };

  const handleToggleActive = async (product: DbProduct) => {
    await productService.updateProduct(product.id, { is_active: !product.is_active });
    await loadData();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SellerPageLayout title="My Products">
      <div className="pt-4 md:pt-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Products ({products.length})</h1>
          <Button size="sm" className="rounded-full" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-[30px]">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No products yet</h3>
            <p className="text-muted-foreground mb-6">Start your selling journey by adding your first product.</p>
            <Button className="rounded-full" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id} className="rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><Package className="h-8 w-8 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-sm font-bold text-primary">₱{product.price.toFixed(2)}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span>Stock: {product.stock}</span>
                          <span>Sold: {product.sold}</span>
                          {!product.is_active && <span className="text-destructive font-semibold">Hidden</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(product)}>
                          {product.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-[30px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl" placeholder="e.g. Fresh Calamansi (1kg)" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl" rows={3} placeholder="Describe your product..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₱) *</Label>
                  <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} className="rounded-xl" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" min="0" value={form.stock} onChange={(e) => setForm(f => ({ ...f, stock: e.target.value }))} className="rounded-xl" placeholder="0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={form.category} onValueChange={(val) => setForm(f => ({ ...f, category: val }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Product Image URL</Label>
                <Input id="image_url" value={form.image_url} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))} className="rounded-xl" placeholder="https://example.com/image.jpg" />
                {form.image_url && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-muted mt-2">
                    <Image src={form.image_url} alt="Preview" fill className="object-cover" sizes="400px" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="on_sale">On Sale</Label>
                <Switch id="on_sale" checked={form.on_sale} onCheckedChange={(checked) => setForm(f => ({ ...f, on_sale: checked }))} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_auction">Auction Item</Label>
                <Switch id="is_auction" checked={form.is_auction} onCheckedChange={(checked) => setForm(f => ({ ...f, is_auction: checked }))} />
              </div>

              {form.is_auction && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_bid">Starting Bid (₱)</Label>
                    <Input id="current_bid" type="number" step="0.01" min="0" value={form.current_bid} onChange={(e) => setForm(f => ({ ...f, current_bid: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bid_end_time">Bid End Time</Label>
                    <Input id="bid_end_time" type="datetime-local" value={form.bid_end_time} onChange={(e) => setForm(f => ({ ...f, bid_end_time: e.target.value }))} className="rounded-xl" />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSaving} className="rounded-full flex-grow">
                  {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </SellerPageLayout>
  );
}
