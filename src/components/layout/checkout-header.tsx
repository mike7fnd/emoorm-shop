
"use client";

import Link from "next/link";
import { ChevronLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="h-14 flex items-center justify-between px-3">
        <Button variant="ghost" size="icon" aria-label="Back" asChild className="shrink-0">
          <Link href="/cart">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-base font-semibold truncate mx-2">Checkout</h1>
        <Button variant="ghost" size="icon" aria-label="Notifications" asChild className="shrink-0">
          <Link href="/account/notifications">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
