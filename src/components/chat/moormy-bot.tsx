'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, X, Send } from 'lucide-react';
import { moormyChat } from '@/ai/flows/moormy-chat-flow';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export function MoormyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am Moormy, your E-Moorm assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await moormyChat({ history, message: userMessage });
      setMessages((prev) => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-8">
      {isOpen ? (
        <Card className="w-80 h-[450px] flex flex-col shadow-2xl rounded-[30px] border-primary/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-base font-bold">Moormy Bot</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 rounded-full" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-accent/5" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-[20px] px-4 py-2 text-sm shadow-sm",
                  m.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-white text-foreground rounded-tl-none border"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border text-foreground max-w-[80%] rounded-[20px] rounded-tl-none px-4 py-2 text-sm animate-pulse">
                  Moormy is thinking...
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-3 border-t bg-background">
            <form className="flex w-full gap-2 items-center" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              <Input 
                placeholder="Ask me anything..." 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-full h-10 bg-muted/50 border-none focus-visible:ring-primary"
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-full flex-shrink-0" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 p-0"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
}
