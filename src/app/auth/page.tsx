'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthLoginForm, AuthSignUpForm } from '@/components/auth/auth-bottom-sheet';
import { useUser } from '@/supabase/provider';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading } = useUser();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // If user is already logged in, redirect to account
  useEffect(() => {
    if (user && !isLoading) {
      router.replace('/account');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-row bg-background">
      {/* Left image area */}
      <div className="relative hidden md:block md:w-1/2 shrink-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop"
          alt="Shopping"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
        {/* Logo overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Image
              src="https://image2url.com/r2/default/images/1769822813493-b3b30748-4fdb-4a02-b16a-f2d85a882941.png"
              alt="E-Moorm Logo"
              width={96}
              height={96}
              className="h-24 w-24 object-contain mx-auto drop-shadow-lg"
            />
            <h1 className="text-white text-3xl font-bold drop-shadow-lg">E-Moorm</h1>
            <p className="text-white/80 text-sm drop-shadow-md">Your local marketplace</p>
          </div>
        </div>
      </div>

      {/* Right form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 md:px-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          {mode === 'login' ? (
            <AuthLoginForm onSwitchToSignUp={() => setMode('signup')} showLogo={false} />
          ) : (
            <AuthSignUpForm onSwitchToLogin={() => setMode('login')} showLogo={false} />
          )}
        </div>
      </div>
    </div>
  );
}
