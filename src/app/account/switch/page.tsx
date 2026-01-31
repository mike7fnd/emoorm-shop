
'use client';

import { AccountHeader } from '@/components/layout/account-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, User, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockAccounts = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://picsum.photos/seed/user1/100/100', active: true },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'https://picsum.photos/seed/user2/100/100', active: false },
]

export default function SwitchAccountPage() {
  return (
    <>
      <AccountHeader title="Switch Account" />
      <main className="container mx-auto px-4 pt-4 pb-24 md:pb-8">
        <div className="space-y-4">
            {mockAccounts.map(account => (
                 <Card key={account.id} className={cn(
                    "hover:bg-accent transition-colors cursor-pointer",
                    account.active && "border-primary"
                 )}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={account.avatar} />
                                <AvatarFallback>
                                    <User className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{account.name}</p>
                                <p className="text-sm text-muted-foreground">{account.email}</p>
                            </div>
                        </div>
                        {account.active && <CheckCircle className="h-6 w-6 text-primary" />}
                    </CardContent>
                </Card>
            ))}

            <Card className="hover:bg-accent transition-colors cursor-pointer border-2 border-dashed">
                <CardContent className="p-4 flex items-center gap-4">
                     <div className="h-12 w-12 flex items-center justify-center bg-secondary rounded-full">
                        <PlusCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-primary">Add Account</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
