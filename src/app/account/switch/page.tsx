
'use client';

import { AccountPageLayout } from '@/components/layout/account-page-layout';
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
    <AccountPageLayout title="Switch Account">
      <div className="pt-4 md:pt-0">
        <h1 className="hidden md:block text-2xl font-bold mb-6">Switch Account</h1>
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

          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 flex items-center justify-center bg-secondary rounded-full">
                <PlusCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-semibold text-primary">Add Account</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccountPageLayout>
  );
}
