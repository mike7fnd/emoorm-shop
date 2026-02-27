'use client';

import { useState, createContext, useContext, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/supabase/provider';
import { auth } from '@/supabase/auth';

// ─── Context to open the auth sheet from anywhere ───────────────────────────

interface AuthSheetContextType {
  openAuthSheet: (mode?: 'login' | 'signup') => void;
}

const AuthSheetContext = createContext<AuthSheetContextType>({
  openAuthSheet: () => {},
});

export function useAuthSheet() {
  return useContext(AuthSheetContext);
}

// ─── Login Form ─────────────────────────────────────────────────────────────

export function AuthLoginForm({ onSwitchToSignUp, showLogo = true }: { onSwitchToSignUp: () => void; showLogo?: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await auth.signInWithPassword(supabase, { email, password });
      if (signInError) {
        setError(signInError.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 px-2">
      <div className="text-center space-y-2">
        {showLogo && (
          <div className="flex justify-center">
            <Image
              src="https://image2url.com/r2/default/images/1769822813493-b3b30748-4fdb-4a02-b16a-f2d85a882941.png"
              alt="E-Moorm Logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-muted-foreground text-sm">Login to your account</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="sheet-email">Email</Label>
          <Input
            id="sheet-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sheet-password">Password</Label>
          <Input
            id="sheet-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <Button type="submit" className="w-full rounded-full h-11 text-base" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <LogIn className="h-4 w-4 mr-2" />
          )}
          Login
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-primary hover:underline font-medium"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Sign Up Form ───────────────────────────────────────────────────────────

export function AuthSignUpForm({ onSwitchToLogin, showLogo = true }: { onSwitchToLogin: () => void; showLogo?: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await auth.signUp(supabase, { email, password });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full space-y-6 text-center px-2">
        {showLogo && (
          <div className="flex justify-center">
            <Image
              src="https://image2url.com/r2/default/images/1769822813493-b3b30748-4fdb-4a02-b16a-f2d85a882941.png"
              alt="E-Moorm Logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight">Check Your Email</h2>
        <p className="text-muted-foreground">
          We&apos;ve sent a confirmation email to <strong>{email}</strong>.
          Please check your inbox and click the link to verify your account.
        </p>
        <Button onClick={onSwitchToLogin} className="w-full rounded-full h-11 text-base">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 px-2">
      <div className="text-center space-y-2">
        {showLogo && (
          <div className="flex justify-center">
            <Image
              src="https://image2url.com/r2/default/images/1769822813493-b3b30748-4fdb-4a02-b16a-f2d85a882941.png"
              alt="E-Moorm Logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
        <p className="text-muted-foreground text-sm">Sign up for a new account</p>
      </div>
      <form onSubmit={handleSignUp} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="sheet-signup-email">Email</Label>
          <Input
            id="sheet-signup-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sheet-signup-password">Password</Label>
          <Input
            id="sheet-signup-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sheet-confirm-password">Confirm Password</Label>
          <Input
            id="sheet-confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <Button type="submit" className="w-full rounded-full h-11 text-base" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <UserPlus className="h-4 w-4 mr-2" />
          )}
          Sign Up
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Provider + Sheet ───────────────────────────────────────────────────────

export function AuthSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const openAuthSheet = useCallback((m: 'login' | 'signup' = 'login') => {
    // Desktop: navigate to dedicated auth page
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      router.push(`/auth?mode=${m}`);
      return;
    }
    // Mobile: open bottom sheet
    setMode(m);
    setOpen(true);
  }, [router]);

  return (
    <AuthSheetContext.Provider value={{ openAuthSheet }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-[30px] pb-10">
          <SheetHeader className="sr-only">
            <SheetTitle>{mode === 'login' ? 'Login' : 'Sign Up'}</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {mode === 'login' ? (
              <AuthLoginForm onSwitchToSignUp={() => setMode('signup')} />
            ) : (
              <AuthSignUpForm onSwitchToLogin={() => setMode('login')} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </AuthSheetContext.Provider>
  );
}
