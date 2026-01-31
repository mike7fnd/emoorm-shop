
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, MessageCircle, MapPin } from 'lucide-react';
import type { Store } from '@/lib/data';

type StoreInfoCardProps = {
    store: Store;
}

const formatFollowers = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
};

export function StoreInfoCard({ store }: StoreInfoCardProps) {
    return (
        <div className="relative">
            <div className="relative h-48 md:h-64 w-full rounded-[30px] overflow-hidden shadow-lg">
                <Image 
                    src={store.image.src} 
                    alt={`${store.name} banner`}
                    fill
                    className="object-cover"
                    data-ai-hint={store.image.hint}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <Card className="relative mx-auto -mt-20 max-w-md rounded-[30px] shadow-xl">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold">{store.name}</h1>
                        <div className="flex items-center text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span>{store.address}</span>
                        </div>

                        <div className="flex justify-around items-center w-full my-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-lg font-bold">{store.rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">Rating</span>
                            </div>
                            <div className="h-10 w-px bg-border" />
                             <div className="flex flex-col items-center gap-1">
                                <span className="text-lg font-bold">{formatFollowers(store.followers)}</span>
                                <span className="text-xs text-muted-foreground">Followers</span>
                            </div>
                            <div className="h-10 w-px bg-border" />
                            <div className="flex flex-col items-center gap-1">
                                 <span className="text-lg font-bold">{store.productCount}</span>
                                <span className="text-xs text-muted-foreground">Products</span>
                            </div>
                        </div>

                        <div className="flex w-full items-center gap-2">
                            <Button className="w-full rounded-[30px]">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Follow
                            </Button>
                            <Button variant="outline" className="w-full rounded-[30px]">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Message
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
