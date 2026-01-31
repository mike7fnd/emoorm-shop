'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

const PULL_THRESHOLD = 100; // Pixels to pull down to trigger refresh
const REFRESH_THRESHOLD = 70; // Pixels from top where refresh happens

export function PullToRefresh({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isMobile || !containerRef.current || !triggerRef.current || !loaderRef.current) return;

    const container = containerRef.current;
    const trigger = triggerRef.current;
    const loader = loaderRef.current;
    
    gsap.set(trigger, { y: -PULL_THRESHOLD });
    gsap.set(loader, { y: -REFRESH_THRESHOLD, scale: 0 });

    const dragger = Draggable.create(trigger, {
      type: 'y',
      bounds: { minY: -PULL_THRESHOLD, maxY: 0 },
      onPress() {
        if (window.scrollY > 0 || isRefreshing) {
          this.disable();
        } else {
          this.enable();
        }
      },
      onDrag() {
        const pullDistance = this.y;
        const progress = pullDistance / PULL_THRESHOLD;
        gsap.to(loader, { 
            scale: progress,
            opacity: progress,
            ease: 'power1.out',
            duration: 0.1 
        });
         gsap.to(loader, { 
            rotation: pullDistance * 2,
            duration: 0.1
        });
      },
      onRelease() {
        if (this.y >= 0) {
          setIsRefreshing(true);
          gsap.to(loader, { y: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power2.in' });
          gsap.to(container, { y: REFRESH_THRESHOLD, duration: 0.3, ease: 'power2.in' });

          // Start the loader animation
          gsap.to(loader, { rotation: '+=360', duration: 1, ease: 'none', repeat: -1 });

          // Simulate refresh and then reset
          setTimeout(() => {
            router.refresh();
            // Wait for refresh to complete (can't be known exactly, so we wait a bit)
            setTimeout(() => {
                 gsap.to([container, loader], { y: 0, duration: 0.5, ease: 'power2.out', onComplete: () => {
                    gsap.to(loader, {scale: 0, opacity: 0, y: -REFRESH_THRESHOLD });
                    gsap.set(trigger, { y: -PULL_THRESHOLD });
                    gsap.killTweensOf(loader);
                    setIsRefreshing(false);
                 }});
            }, 1000);
          }, 500);

        } else {
          // Snap back
          gsap.to(trigger, { y: -PULL_THRESHOLD, duration: 0.3, ease: 'power2.out' });
          gsap.to(loader, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
        }
      },
    });

    return () => {
      dragger[0]?.kill();
    };
  }, [isMobile, isRefreshing, router]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative">
       <div 
        ref={triggerRef}
        className="absolute top-0 left-0 w-full h-[100px] z-10" 
        style={{ touchAction: 'pan-y' }}
      />
      <div 
        ref={loaderRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-background rounded-full shadow-lg z-0"
      >
        <Loader className="w-6 h-6 text-primary" />
      </div>
      {children}
    </div>
  );
}