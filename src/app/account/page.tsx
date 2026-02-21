
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { AccountPageLayout } from '@/components/layout/account-page-layout';

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
    <Card className="max-w-md mx-auto rounded-[30px] bg-background/95 backdrop-blur-md">
      <CardHeader className="text-center space-y-3">
        <div className="flex justify-center">
          <Image
            src="https://image2url.com/r2/default/images/1769822813493-b3b30748-4fdb-4a02-b16a-f2d85a882941.png"
            alt="E-Moorm Logo"
            width={80}
            height={80}
            className="h-20 w-20 object-contain"
          />
        </div>
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
      <Card className="max-w-md mx-auto rounded-[30px] bg-background/95 backdrop-blur-md">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <Image
              src="https://image2url.com/r2/default/images/1769822813493-b3b30748-4fdb-4a02-b16a-f2d85a882941.png"
              alt="E-Moorm Logo"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />
          </div>
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
    <Card className="max-w-md mx-auto rounded-[30px] bg-background/95 backdrop-blur-md">
      <CardHeader className="text-center space-y-3">
        <div className="flex justify-center">
          <Image
            src="https://image2url.com/r2/default/images/1769822813493-b3b30748-4fdb-4a02-b16a-f2d85a882941.png"
            alt="E-Moorm Logo"
            width={80}
            height={80}
            className="h-20 w-20 object-contain"
          />
        </div>
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
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setHasShop(false);
        return;
      }

      try {
        setIsLoading(true);

        // Load user profile with avatar
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData?.avatar_url) {
          setAvatarSrc(profileData.avatar_url);
        }

        // Check if user has a seller profile
        const { data: sellerData, error: sellerError } = await supabase
          .from('seller_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!sellerError && sellerData) {
          setHasShop(true);
        } else {
          setHasShop(false);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user?.id, supabase]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user?.id) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setAvatarSrc(result);

        try {
          // Update avatar in Supabase
          const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: result })
            .eq('id', user.id);

          if (error) throw error;

          // Dispatch custom event for components listening
          window.dispatchEvent(
            new CustomEvent('avatar-updated', { detail: { newAvatar: result } })
          );
        } catch (error) {
          console.error('Failed to update avatar:', error);
          // Revert avatar change on error
          setAvatarSrc('https://picsum.photos/seed/user/100/100');
        }
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
      <AccountPageLayout title="My Account" hideMobileHeader>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AccountPageLayout>
    );
  }

  // Show login/signup form if not logged in — full-screen, no nav
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Fullscreen background image */}
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Login / Signup card */}
        <div className="relative z-10 w-full px-4">
          {showLoginForm ? (
            <LoginForm onSwitchToSignUp={() => setShowLoginForm(false)} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setShowLoginForm(true)} />
          )}
        </div>
      </div>
    );
  }

  // User is logged in - show account page
  const userEmail = user.email || 'User';
  const userName = user.user_metadata?.name || userEmail.split('@')[0] || 'User';
  const userAvatar = user.user_metadata?.avatar_url || avatarSrc;

  return (
    <AccountPageLayout title="My Account" hideMobileHeader>
      {/* ===== MOBILE LAYOUT (untouched) ===== */}
      <div className="md:hidden">
        {/* Mobile header with action buttons */}
        <div className="h-16 flex items-center justify-between px-4 -mx-4">
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
                    <Link href="/account/notifications">See All Notifications</Link>
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

        {/* Mobile Profile card */}
        <Card className="max-w-md mx-auto rounded-[30px]">
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
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p className="text-muted-foreground">{userEmail}</p>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Orders card */}
        <Card className="max-w-md mx-auto rounded-[30px] mt-4">
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

        {/* Mobile Quick links grid */}
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

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden md:block space-y-6">
        {/* Profile Banner Card */}
        <Card className="rounded-2xl overflow-hidden border-0 shadow-sm">
          {/* Cover gradient */}
          <div className="h-32 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40 relative">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center opacity-20" />
          </div>
          <CardContent className="relative px-6 pb-6">
            <div className="flex items-end gap-5 -mt-12">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <button onClick={handleAvatarClick} className="relative group shrink-0">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg ring-2 ring-primary/20">
                  <AvatarImage src={userAvatar} data-ai-hint="portrait" />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                </div>
              </button>
              <div className="min-w-0 flex-1 pb-1">
                <h1 className="text-2xl font-bold truncate">{userName}</h1>
                <p className="text-muted-foreground text-sm truncate">{userEmail}</p>
              </div>
              <Link href="/account/settings">
                <Button variant="outline" size="sm" className="rounded-full gap-2 shadow-sm">
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">My Orders</CardTitle>
              <Link href="/account/orders/all" className="text-sm text-primary hover:underline font-medium">
                View All Orders
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {orderStatuses.map((status) => (
                <Link href={status.href} key={status.name} className="group">
                  <div className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
                    <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-muted/60 group-hover:bg-primary/10 transition-colors">
                      <status.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.8} />
                      {status.count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                          {status.count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">{status.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-3 px-1">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            <Link href={hasShop ? "/account/my-shop" : "/account/seller-registration"}>
              <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-all group cursor-pointer h-full">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                    <Store className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{hasShop ? 'My Shop' : 'Be a Seller'}</p>
                    <p className="text-xs text-muted-foreground">{hasShop ? 'Manage your store' : 'Start selling today'}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/account/vouchers">
              <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-all group cursor-pointer h-full">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                    <Ticket className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">My Vouchers</p>
                    <p className="text-xs text-muted-foreground">View available deals</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/account/help">
              <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-all group cursor-pointer h-full">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">Help Center</p>
                    <p className="text-xs text-muted-foreground">Get support & FAQs</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <Link href="/account/notifications" className="text-sm text-primary hover:underline font-medium">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {mockNotifications.map((notif, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <notif.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap pt-0.5">{notif.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountPageLayout>
  );
}
