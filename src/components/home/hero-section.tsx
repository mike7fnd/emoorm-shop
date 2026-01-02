'use client';

import Image from 'next/image';
import { placeholderImageMap } from '@/lib/data';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('hero-dismissed');
    if (dismissed !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hero-dismissed', 'true');
  };
  
  const heroImage = placeholderImageMap.get('hero-1');

  if (!heroImage || !isVisible) {
    return null;
  }
  
  return (
    <div className="relative w-full h-[18vh] md:h-[20vh] group">
      <Image
        src={heroImage.src}
        alt="Stylish collection"
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImage.hint}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white z-10"
        onClick={handleDismiss}
        aria-label="Dismiss hero banner"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
