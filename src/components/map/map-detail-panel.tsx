
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "../ui/button";
import dynamic from "next/dynamic";
import type { Store } from "@/lib/data";
import { MapPin, Navigation } from "lucide-react";

const StoreMap = dynamic(() => import('@/components/map/store-map'), { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted rounded-md animate-pulse" />
});

type MapDetailPanelProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    store: Store;
}

export function MapDetailPanel({ isOpen, onOpenChange, store }: MapDetailPanelProps) {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
    
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent 
                side="bottom" 
                className="h-[90vh] flex flex-col p-4 md:p-6"
            >
                <SheetHeader className="flex-shrink-0">
                    <SheetTitle className="text-2xl">{store.name}</SheetTitle>
                    <SheetDescription className="flex items-start text-base">
                        <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-primary" />
                        <span>{store.address}</span>
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-grow my-4 rounded-lg overflow-hidden">
                    <StoreMap lat={store.lat} lng={store.lng} isInteractive={true} />
                </div>
                <div className="flex-shrink-0">
                    <Button asChild size="lg" className="w-full rounded-[30px]">
                        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                            <Navigation className="mr-2 h-5 w-5" />
                            Get Directions
                        </a>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
