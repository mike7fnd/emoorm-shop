'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const ONBOARDING_KEY = 'e-moorm-onboarding-seen';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    image:
      'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Welcome to E-Moorm',
    subtitle: 'Your Local Marketplace',
    description:
      'Discover authentic Mindoro products — from farm-fresh goods to handcrafted treasures, all in one place.',
  },
  {
    image:
      'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Shop Local Goodness',
    subtitle: 'Fresh & Authentic',
    description:
      'Browse fresh produce, local delicacies, native fashion, and unique handicrafts made by talented Mindoro artisans.',
  },
  {
    image:
      'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Fast & Easy Checkout',
    subtitle: 'Seamless Experience',
    description:
      'Enjoy a smooth shopping experience with secure payments and reliable delivery right to your doorstep.',
  },
];

export function OnboardingSplash() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      setShow(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    setExiting(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setTimeout(() => setShow(false), 500);
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    if (currentSlide === slides.length - 1) {
      dismiss();
      return;
    }
    setIsAnimating(true);
    setDirection('next');
    setCurrentSlide((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  }, [currentSlide, dismiss, isAnimating]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide) return;
      setIsAnimating(true);
      setDirection(index > currentSlide ? 'next' : 'prev');
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [currentSlide, isAnimating]
  );

  if (!show) return null;

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] transition-all duration-500 bg-black',
        exiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      )}
    >
      {/* Background images – all preloaded, only the active one is visible */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === currentSlide ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
            unoptimized
          />
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-6 h-full pt-safe-top pb-safe-bottom">
        {/* Skip button */}
        <div className="w-full flex justify-end pt-12 pb-4">
          {!isLast && (
            <button
              onClick={dismiss}
              className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-full 
                         backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              Skip
            </button>
          )}
        </div>

        {/* Spacer pushes text to bottom */}
        <div className="flex-1" />

        {/* Text content — anchored to the bottom */}
        <div className="pb-4">
          <div
            key={`text-${currentSlide}`}
            className={cn(
              'animate-in fade-in duration-500',
              direction === 'next' ? 'slide-in-from-right-6' : 'slide-in-from-left-6'
            )}
          >
            <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              {slide.subtitle}
            </p>
            <h1 className="text-white text-3xl font-bold mb-3 leading-tight">
              {slide.title}
            </h1>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xs">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="w-full pb-10 pt-6 space-y-5">
          {/* Dots indicator */}
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-[6px] rounded-full transition-all duration-300',
                  index === currentSlide
                    ? 'w-8 bg-white'
                    : 'w-[6px] bg-white/40 hover:bg-white/60'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next / Get Started button */}
          <Button
            onClick={nextSlide}
            className={cn(
              'w-full h-14 rounded-full text-base font-semibold',
              'bg-white text-gray-900 hover:bg-white/90 shadow-xl',
              'transition-all duration-200 active:scale-[0.98]'
            )}
          >
            {isLast ? 'Get Started' : 'Next'}
            {!isLast && <ChevronRight className="w-5 h-5 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
