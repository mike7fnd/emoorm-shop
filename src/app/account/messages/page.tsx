'use client';

import { AccountPageLayout } from '@/components/layout/account-page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

const mockMessages = [
    { id: '1', name: 'E-Moorm Support', message: 'Thank you for your feedback! We are always...', timestamp: '2:45 PM', avatar: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-J0g8UaY3rQJ8S3f9G0V8v6S8bK9p18.png', unread: true },
    { id: '2', name: 'Calapan Agri-Hub', message: 'Your order has been shipped. Track it...', timestamp: 'Yesterday', avatar: 'https://picsum.photos/seed/store1/40/40', unread: false },
    { id: '3', name: 'Mangyan Heritage', message: 'We have new arrivals! Check them out.', timestamp: 'Jul 23', avatar: 'https://picsum.photos/seed/store4/40/40', unread: false },
    { id: '4', name: 'Promotions', message: 'Weekly deals are here! Don\'t miss out.', timestamp: 'Jul 21', avatar: 'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-yT1h2i71wX7s4u2p1qG1bM2g4E5p2T.png', unread: false },
];


export default function MessagesPage() {
  return (
    <AccountPageLayout title="Messages">
      <div className="pt-4 md:pt-0">
        <h1 className="hidden md:block text-2xl font-bold mb-6">Messages</h1>
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-10" />
        </div>

        <Card className="rounded-[20px] overflow-hidden">
          <ul className="divide-y">
              {mockMessages.map(message => (
                  <li key={message.id}>
                      <Link href="#" className="block hover:bg-accent transition-colors">
                          <div className="flex items-start gap-4 p-4">
                              <Avatar className="h-12 w-12">
                                  <AvatarImage src={message.avatar} />
                                  <AvatarFallback>
                                      <User className="h-6 w-6" />
                                  </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                  <div className="flex justify-between">
                                      <p className="font-semibold">{message.name}</p>
                                      <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                              </div>
                          </div>
                      </Link>
                  </li>
              ))}
          </ul>
        </Card>
      </div>
    </AccountPageLayout>
  );
}
