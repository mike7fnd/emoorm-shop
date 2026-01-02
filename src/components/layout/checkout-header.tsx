"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="h-16 flex items-center justify-between gap-4 px-4 sm:px-6 relative">
        <Button variant="ghost" size="icon" aria-label="Back" asChild>
          <Link href="/cart">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-lg font-semibold">Checkout</h1>
        </div>
      </div>
    </header>
  );
}