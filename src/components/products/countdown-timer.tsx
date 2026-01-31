'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

type CountdownTimerProps = {
  endTime: string;
  className?: string;
  showIcon?: boolean;
  suffix?: string;
};

type TimeLeft = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

export function CountdownTimer({ endTime, className, showIcon = true, suffix }: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });
  
  const hasTimeLeft = Object.values(timeLeft).some(val => val !== undefined && val > 0);

  return (
    <div className={cn("flex items-center gap-1 text-[10px] sm:text-xs font-medium", className)}>
      {hasTimeLeft ? (
        <>
            {showIcon && <Timer className="h-3 w-3" />}
            <span>
                {timeLeft.days !== undefined && timeLeft.days > 0 && `${timeLeft.days}d `} 
                {timeLeft.hours !== undefined && (timeLeft.hours > 0 || (timeLeft.days ?? 0) > 0) && `${timeLeft.hours}h `}
                {timeLeft.minutes}m {timeLeft.seconds}s
                {suffix && ` ${suffix}`}
            </span>
        </>
      ) : (
        <span className="text-muted-foreground">Ended</span>
      )}
    </div>
  );
}
