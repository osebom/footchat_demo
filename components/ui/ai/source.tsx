'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLinkIcon } from 'lucide-react';

const Sources = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t pt-3 mt-3', className)}
    {...props}
  />
));
Sources.displayName = 'Sources';

const SourcesTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    count?: number;
    isOpen?: boolean;
  }
>(({ className, count = 0, isOpen, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
      className
    )}
    {...props}
  >
    <span>Used {count} source{count !== 1 ? 's' : ''}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('transition-transform', isOpen && 'rotate-180')}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
));
SourcesTrigger.displayName = 'SourcesTrigger';

const SourcesContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen?: boolean;
  }
>(({ className, isOpen, ...props }, ref) => {
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn('mt-2 space-y-2', className)}
      {...props}
    />
  );
});
SourcesContent.displayName = 'SourcesContent';

const Source = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    title: string;
    url: string;
  }
>(({ className, title, url, ...props }, ref) => (
  <a
    ref={ref}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      'flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors',
      className
    )}
    {...props}
  >
    <ExternalLinkIcon className="h-4 w-4" />
    <span>{title}</span>
  </a>
));
Source.displayName = 'Source';

export { Sources, SourcesTrigger, SourcesContent, Source };

