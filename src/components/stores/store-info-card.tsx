
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, MessageCircle, MapPin, Loader2 } from 'lucide-react';
import type { Store } from '@/lib/data';
import { storeService } from '@/supabase/services/stores';
import { useUser } from '@/supabase/provider';

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
  const { user } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [followerCount, setFollowerCount] = useState(store.followers);

  useEffect(() => {
    if (!user?.id) return;
    const checkFollow = async () => {
      const following = await storeService.isFollowing(user.id, store.id);
      setIsFollowing(following);
    };
    checkFollow();
  }, [user?.id, store.id]);

  useEffect(() => {
    setFollowerCount(store.followers);
  }, [store.followers]);

  const handleFollowToggle = async () => {
    if (!user?.id || isLoadingFollow) return;
    setIsLoadingFollow(true);
    try {
      if (isFollowing) {
        const success = await storeService.unfollowStore(user.id, store.id);
        if (success) {
          setIsFollowing(false);
          setFollowerCount((prev) => Math.max(prev - 1, 0));
        }
      } else {
        const success = await storeService.followStore(user.id, store.id);
        if (success) {
          setIsFollowing(true);
          setFollowerCount((prev) => prev + 1);
        }
      }
    } finally {
      setIsLoadingFollow(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative h-48 md:h-64 w-full rounded-[30px] overflow-hidden">
        <Image
          src={store.image.src}
          alt={`${store.name} banner`}
          fill
          className="object-cover"
          data-ai-hint={store.image.hint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <Card className="relative mx-auto -mt-20 max-w-md rounded-[30px]">
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
                <span className="text-lg font-bold">{formatFollowers(followerCount)}</span>
                <span className="text-xs text-muted-foreground">Followers</span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">{store.productCount}</span>
                <span className="text-xs text-muted-foreground">Products</span>
              </div>
            </div>

            <div className="flex w-full items-center gap-2">
              <Button
                className="w-full rounded-[30px]"
                variant={isFollowing ? 'outline' : 'default'}
                onClick={handleFollowToggle}
                disabled={!user || isLoadingFollow}
              >
                {isLoadingFollow ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isFollowing ? (
                  <UserCheck className="mr-2 h-4 w-4" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isFollowing ? 'Following' : 'Follow'}
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
