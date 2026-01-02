"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const BRANDS_VISIBLE_COUNT = 5;

type FiltersProps = {
  brands: string[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number];
  setPriceRange: (range: [number]) => void;
  maxPrice: number;
  onClear: () => void;
};

export function Filters({
  brands,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  maxPrice,
  onClear,
}: FiltersProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );
  };
  
  const visibleBrands = showAllBrands ? brands : brands.slice(0, BRANDS_VISIBLE_COUNT);

  return (
    <>
      <div className="flex justify-between items-center p-4 pt-0 shadow-sm">
         <h2 className="text-lg font-semibold">Filters</h2>
         <Button variant="ghost" size="sm" onClick={onClear}>
          Clear All
          <X className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="p-4 pt-0 pb-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-semibold mb-3">Brand</h3>
            <div className="space-y-2">
              {visibleBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => handleBrandChange(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="font-normal">{brand}</Label>
                </div>
              ))}
            </div>
            {brands.length > BRANDS_VISIBLE_COUNT && (
              <Button
                variant="link"
                className="p-0 h-auto mt-2 text-primary"
                onClick={() => setShowAllBrands(!showAllBrands)}
              >
                {showAllBrands ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
          <Separator />
          <div>
            <h3 className="text-md font-semibold mb-3">Price Range</h3>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number])}
                max={maxPrice}
                step={10}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₱0</span>
                <span>₱{priceRange[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

    
