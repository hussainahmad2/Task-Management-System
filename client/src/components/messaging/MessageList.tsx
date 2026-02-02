import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageItem } from './MessageItem';
import { Message } from '../../types/messaging';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  className?: string;
}


export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onLoadMore,
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
    <div className={cn("flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white/70 via-purple-50/20 to-pink-50/20 dark:from-gray-800/70 dark:via-gray-900/30 dark:to-gray-900/40 backdrop-blur-md", className)}>
      {/* Loader for older messages */}
      <div ref={loaderRef} className="h-10"></div>
      
      {isLoadingMore && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((message, index) => (
          <MessageItem
            key={`${message.id}-${index}`}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
      </div>

      {/* Scroll to bottom button when not at bottom */}
      <div className="sticky bottom-4 flex justify-center">
        <button
          onClick={scrollToBottom}
          className={`p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 ${
            messages.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
};