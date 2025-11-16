'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SendIcon, MicIcon, PaperclipIcon } from 'lucide-react';

const PromptInput = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement> & {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  }
>(({ className, onSubmit, children, ...props }, ref) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={cn('border-t bg-background', className)}
      {...props}
    >
      {children}
    </form>
  );
});
PromptInput.displayName = 'PromptInput';

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, onKeyDown, ...props }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = (e.target as HTMLElement).closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
    onKeyDown?.(e);
  };

  return (
    <div className="relative">
      <Textarea
        ref={ref}
        onKeyDown={handleKeyDown}
        className={cn(
          'min-h-[60px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-12 max-w-[50%]',
          className
        )}
        {...props}
      />
    </div>
  );
});
PromptInputTextarea.displayName = 'PromptInputTextarea';

const PromptInputToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between px-4 pb-3', className)}
    {...props}
  />
));
PromptInputToolbar.displayName = 'PromptInputToolbar';

const PromptInputTools = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2', className)}
    {...props}
  />
));
PromptInputTools.displayName = 'PromptInputTools';

const PromptInputButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    type="button"
    variant="ghost"
    size="icon-sm"
    className={cn('h-8 w-8', className)}
    {...props}
  />
));
PromptInputButton.displayName = 'PromptInputButton';

const PromptInputSubmit = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    disabled?: boolean;
  }
>(({ className, disabled, ...props }, ref) => (
  <Button
    ref={ref}
    type="submit"
    size="icon-sm"
    disabled={disabled}
    className={cn('absolute bottom-3 right-3 h-8 w-8', className)}
    {...props}
  >
    <SendIcon className="h-4 w-4" />
    <span className="sr-only">Send message</span>
  </Button>
));
PromptInputSubmit.displayName = 'PromptInputSubmit';

const PromptInputModelSelect = Select;
const PromptInputModelSelectTrigger = SelectTrigger;
const PromptInputModelSelectValue = SelectValue;
const PromptInputModelSelectContent = SelectContent;
const PromptInputModelSelectItem = SelectItem;

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
};

