'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

const Reasoning = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t pt-3 mt-3', className)}
    {...props}
  />
));
Reasoning.displayName = 'Reasoning';

const ReasoningTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isOpen?: boolean;
  }
>(({ className, isOpen, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
      className
    )}
    {...props}
  >
    <span>{children}</span>
    <ChevronDownIcon
      className={cn(
        'h-4 w-4 transition-transform',
        isOpen && 'rotate-180'
      )}
    />
  </button>
));
ReasoningTrigger.displayName = 'ReasoningTrigger';

const ReasoningContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen?: boolean;
  }
>(({ className, isOpen, ...props }, ref) => {
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn('mt-2 text-sm text-muted-foreground whitespace-pre-wrap', className)}
      {...props}
    />
  );
});
ReasoningContent.displayName = 'ReasoningContent';

export { Reasoning, ReasoningTrigger, ReasoningContent };

