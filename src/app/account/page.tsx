
'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Wallet, Package, Truck, Star, LogOut, MoreVertical, Settings, HelpCircle, Users, CreditCard, Shield, MapPin, Bell, MessageSquare, Ticket, Store, LogIn, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useUser, useAuth } from '@/supabase/provider';
import { auth } from '@/supabase/auth';

const orderStatuses = [
  { name: 'To Pay', icon: Wallet, href: '/account/orders/to-pay', count: 1 },
  { name: 'To Ship', icon: Package, href: '/account/orders/to-ship', count: 2 },
  { name: 'To Receive', icon: Truck, href: '/account/orders/to-receive', count: 1 },
  { name: 'To Review', icon: Star, href: '/account/orders/to-review', count: 3 },
];

const menuOptions = [
    { label: 'Account Settings', icon: Settings, href: '/account/settings' },
    { label: 'Shipping Addresses', icon: MapPin, href: '/account/address' },
    { label: 'Payment Methods', icon: CreditCard, href: '/account/payment' },
    { label: 'Help Center', icon: HelpCircle, href: '/account/help' },
    { label: 'Privacy Policy', icon: Shield, href: '/account/privacy' },
    { label: 'Switch Account', icon: Users, href: '/account/switch' },
];

const mockNotifications = [
    { icon: Truck, title: "Order Shipped", description: "Your order ORD-001 has been shipped.", time: "5m ago" },
    { icon: Ticket, title: "New Voucher", description: "You've received a 10% off voucher!", time: "1h ago" },
    { icon: Star, title: "Rate Product", description: "Please rate your recent purchase.", time: "3h ago" },
]

function LoginForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
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
    <Card className="max-w-md mx-auto rounded-[30px] shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <p className="text-muted-foreground text-sm">Login to your account</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
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
      </CardContent>
    </Card>
  );
}

function SignUpForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
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
      <Card className="max-w-md mx-auto rounded-[30px] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We&apos;ve sent a confirmation email to <strong>{email}</strong>.
            Please check your inbox and click the link to verify your account.
          </p>
          <Button onClick={onSwitchToLogin} className="w-full rounded-full">
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto rounded-[30px] shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <p className="text-muted-foreground text-sm">Sign up for a new account</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
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
      </CardContent>
    </Card>
  );
}

export default function AccountPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const supabase = useAuth();
  const [avatarSrc, setAvatarSrc] = useState('https://picsum.photos/seed/user/100/100');
  const [hasShop, setHasShop] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('user-avatar');
    if (savedAvatar) {
      setAvatarSrc(savedAvatar);
    }

    const sellerProfile = localStorage.getItem('seller-profile');
    if (sellerProfile) {
      setHasShop(true);
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarSrc(result);
        localStorage.setItem('user-avatar', result);
        window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { newAvatar: result }}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut(supabase);
  };

  // Show loading state while checking auth
  if (isUserLoading) {
    return (
      <>
        <div className="hidden md:block">
          <Header showSearch={false} />
        </div>
        <main className="pb-24 md:pb-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </>
    );
  }

  // Show login/signup form if not logged in
  if (!user) {
    return (
      <>
        <div className="hidden md:block">
          <Header showSearch={false} />
        </div>
        <main className="pb-24 md:pb-8">
          <div className="md:hidden h-16 flex items-center justify-between px-4">
            <h1 className="text-lg font-semibold">My Account</h1>
          </div>
          <div className="container mx-auto px-4 pt-0 md:pt-8 relative">
            {showLoginForm ? (
              <LoginForm onSwitchToSignUp={() => setShowLoginForm(false)} />
            ) : (
              <SignUpForm onSwitchToLogin={() => setShowLoginForm(true)} />
            )}
          </div>
        </main>
      </>
    );
  }

  // User is logged in - show account page
  const userEmail = user.email || 'User';
  const userName = user.user_metadata?.name || userEmail.split('@')[0] || 'User';
  const userAvatar = user.user_metadata?.avatar_url || avatarSrc;

  return (
    <>
      <div className="hidden md:block">
        <Header showSearch={false} />
      </div>
      <main className="pb-24 md:pb-8">
         <div className="md:hidden h-16 flex items-center justify-between px-4">
            <h1 className="text-lg font-semibold">My Account</h1>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/account/messages">
                        <MessageSquare className="h-5 w-5" />
                    </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 rounded-[15px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-1">
                        {mockNotifications.map((notif, index) => (
                           <DropdownMenuItem key={index} className="flex items-start gap-3 rounded-md">
                                <notif.icon className="h-4 w-4 mt-1 text-primary" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{notif.title}</p>
                                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{notif.time}</p>
                           </DropdownMenuItem>
                        ))}
                    </div>
                    <DropdownMenuSeparator />
                     <div className="p-1">
                        <DropdownMenuItem asChild className="justify-center rounded-md">
                           <Link href="/account/notifications">
                             See All Notifications
                           </Link>
                        </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-[15px]">
                     {menuOptions.map((option) => (
                        <DropdownMenuItem key={option.label} asChild className="rounded-md">
                            <Link href={option.href}>
                                <option.icon className="mr-2 h-4 w-4" />
                                <span>{option.label}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive rounded-md cursor-pointer"
                      onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div className="container mx-auto px-4 pt-0 md:pt-8 relative">
            <Card className="max-w-md mx-auto rounded-[30px] shadow-xl">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <button onClick={handleAvatarClick} className="relative group">
                            <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-lg">
                                <AvatarImage src={userAvatar} data-ai-hint="portrait" />
                                <AvatarFallback>
                                    <User className="h-10 w-10" />
                                </AvatarFallback>
                            </Avatar>
                        </button>
                        <h1 className="text-2xl font-bold">{userName}</h1>
                        <p className="text-muted-foreground">{userEmail}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="max-w-md mx-auto rounded-[30px] shadow-xl mt-4">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">My Orders</CardTitle>
                        <Link href="/account/orders/all" className="text-sm text-primary hover:underline">
                            View All
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="flex justify-around w-full">
                        {orderStatuses.map((status) => (
                          <Link href={status.href} key={status.name} className="flex flex-col items-center gap-1 text-foreground hover:text-primary transition-colors">
                            <div className="relative">
                                <status.icon className="h-7 w-7" strokeWidth={1.5} />
                                {status.count > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {status.count}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{status.name}</span>
                          </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="max-w-md mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                <Link href={hasShop ? "/account/my-shop" : "/account/seller-registration"}>
                    <Card className="hover:bg-accent transition-colors h-full">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                           <Image src="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kgYMsaYJpFuQ4XMNy0GYQ2zmrWOuJz.png" alt="Be a Seller" width={100} height={100} />
                           <p className="font-semibold text-sm mt-2">{hasShop ? 'My Shop' : 'Be a Seller'}</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link href="/account/vouchers">
                    <Card className="hover:bg-accent transition-colors h-full">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                           <Image src="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-xPBxqYxnSi0VmK3ALnqKVxdTMKcII9.png" alt="My Vouchers" width={100} height={100} />
                           <p className="font-semibold text-sm mt-2">My Vouchers</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link href="/account/help">
                    <Card className="hover:bg-accent transition-colors h-full">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                           <Image src="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-m3g6C1b2A0S8R9p2W6n4Q5Y7vX8Z2k.png" alt="Help Center" width={100} height={100} />
                           <p className="font-semibold text-sm mt-2">Help Center</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
      </main>
    </>
  );
}
