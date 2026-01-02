import type { Product } from "@/lib/data";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
  showMoveToCart?: boolean;
};

export function ProductGrid({ products, showMoveToCart = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-2">No products found</h2>
        <p className="text-muted-foreground">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showMoveToCart={showMoveToCart} />
      ))}
    </div>
  );
}
