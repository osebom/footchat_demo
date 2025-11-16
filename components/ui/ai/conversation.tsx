'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Conversation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-conversation
    className={cn('relative flex flex-col overflow-hidden', className)}
    {...props}
  />
));
Conversation.displayName = 'Conversation';

const ConversationContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-conversation-content
    className={cn('flex-1 overflow-y-auto px-4 py-6', className)}
    {...props}
  />
));
ConversationContent.displayName = 'ConversationContent';

const ConversationScrollButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void;
  }
>(({ className, onClick, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    
    const conversation = button.closest('[data-conversation]') || 
                         button.parentElement;
    const content = conversation?.querySelector('[data-conversation-content]') as HTMLElement;
    if (!content) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = content;
      setIsVisible(scrollHeight - scrollTop - clientHeight > 100);
    };

    content.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => content.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const button = buttonRef.current;
    if (!button) return;
    
    const conversation = button.closest('[data-conversation]') || 
                         button.parentElement;
    const content = conversation?.querySelector('[data-conversation-content]') as HTMLElement;
    if (content) {
      content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' });
    }
    onClick?.();
  };

  React.useEffect(() => {
    if (typeof ref === 'function') {
      ref(buttonRef.current);
    } else if (ref) {
      ref.current = buttonRef.current;
    }
  }, [ref]);

  if (!isVisible) return null;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className={cn(
        'absolute bottom-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border shadow-sm hover:bg-accent transition-colors',
        className
      )}
      {...props}
    >
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
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
      <span className="sr-only">Scroll to bottom</span>
    </button>
  );
});
ConversationScrollButton.displayName = 'ConversationScrollButton';

export { Conversation, ConversationContent, ConversationScrollButton };

