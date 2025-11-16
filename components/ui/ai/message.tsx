'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  from?: 'user' | 'assistant';
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, from = 'user', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex gap-3 py-4',
        from === 'user' ? 'flex-row-reverse' : 'flex-row',
        className
      )}
      {...props}
    />
  )
);
Message.displayName = 'Message';

const MessageAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src?: string;
    name?: string;
  }
>(({ className, src, name, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium',
      className
    )}
    {...props}
  >
    {src ? (
      <img src={src} alt={name} className="h-full w-full rounded-full" />
    ) : (
      <span>{name?.[0]?.toUpperCase() || 'U'}</span>
    )}
  </div>
));
MessageAvatar.displayName = 'MessageAvatar';

const MessageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 space-y-2', className)}
    {...props}
  />
));
MessageContent.displayName = 'MessageContent';

export { Message, MessageAvatar, MessageContent };

