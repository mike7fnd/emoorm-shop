
'use client';

import { AccountHeader } from '@/components/layout/account-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, User, Mail, Phone, Lock, Bell } from 'lucide-react';
import Link from 'next/link';


export default function SettingsPage() {
  return (
    <>
      <AccountHeader title="Account Settings" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <Card>
            <CardContent className="p-0">
                <ul className="divide-y">
                    <li className="p-4 flex items-center justify-between hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <User className="w-5 h-5 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-medium">Profile Information</span>
                                <span className="text-sm text-muted-foreground">Name, email, and phone number</span>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </li>
                    <li className="p-4 flex items-center justify-between hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-medium">Change Password</span>
                                <span className="text-sm text-muted-foreground">Update your password</span>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </li>
                     <li className="p-4 flex items-center justify-between hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-medium">Notifications</span>
                                <span className="text-sm text-muted-foreground">Manage your notifications</span>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </li>
                </ul>
            </CardContent>
        </Card>
        <div className="mt-8">
            <Button variant="destructive" className="w-full">Sign Out</Button>
        </div>
      </main>
    </>
  );
}
