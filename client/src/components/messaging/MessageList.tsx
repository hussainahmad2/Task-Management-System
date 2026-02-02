import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageItem } from './MessageItem';
import { Message } from '../../types/messaging';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onLoadMore?: () => void;
  onDeleteMessage?: (messageId: string) => void;
  isLoadingMore?: boolean;
  className?: string;
}


export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onLoadMore,
  onDeleteMessage,
  isLoadingMore = false,
  className
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loaderRef.current && !isScrolling) {
        const rect = loaderRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
          setIsScrolling(true);
          onLoadMore?.();
          setTimeout(() => setIsScrolling(false), 1000); // Prevent rapid loading
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, isScrolling]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={cn("flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900", className)}>
      {/* Loader for older messages */}
      <div ref={loaderRef} className="h-10"></div>
      
      {isLoadingMore && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      <div className="space-y-2">
        {messages.map((message, index) => (
          <MessageItem
            key={`${message.id}-${index}`}
            message={message}
            isOwn={message.senderId === currentUserId}
            onDelete={onDeleteMessage}
          />
        ))}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
};