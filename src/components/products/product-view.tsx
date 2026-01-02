"use client";

import type { Product } from "@/lib/data";
import { ProductGrid } from "./product-grid";

type FilterState = {
  brands: string[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number];
  setPriceRange: (range: [number]) => void;
  maxPrice: number;
  onClear: () => void;
};

type ProductViewProps = {
  products: Product[];
  categories: string[];
  brands: string[];
  filterState: FilterState;
  isClient: boolean;
};

export function ProductView({ products, isClient }: ProductViewProps) {
  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
      <div className="flex flex-1 flex-col" id="products">
        <div className="p-4 md:p-6">
          <ProductGrid products={products} />
        </div>
      </div>
  );
}
