import React from 'react';
import { Message } from '../../types/messaging';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'text':
        return <span>{message.content}</span>;
      case 'image':
        return (
          <div className="max-w-xs">
            <img 
              src={message.mediaUrl || ''} 
              alt="Sent image" 
              className="rounded-lg max-w-full h-auto cursor-pointer"
            />
          </div>
        );
      case 'sticker':
        return (
          <img 
            src={message.mediaUrl || ''} 
            alt="Sticker" 
            className="max-w-24 h-auto cursor-pointer"
          />
        );
      case 'document':
        return (
          <a 
            href={message.mediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <div className="font-medium">Document</div>
              <div className="text-xs text-gray-500">{(message.fileSize || 0)} bytes</div>
            </div>
          </a>
        );
      case 'location':
        return (
          <div className="bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm">
            <div className="font-medium">Location shared</div>
            <div className="text-sm text-gray-500">{message.content}</div>
          </div>
        );
      default:
        return <span>{message.content}</span>;
    }
  };

  const getStatusIcon = () => {
    if (!isOwn) return null;
    
    // Determine message status icon
    const sent = message.status?.some(s => s.status === 'sent');
    const delivered = message.status?.some(s => s.status === 'delivered');
    const read = message.status?.some(s => s.status === 'read');
    
    if (read) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else if (delivered) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
          isOwn
            ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white rounded-br-md animate-pulse'
            : 'bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 rounded-bl-md border-2 border-purple-200/30 dark:border-purple-700/50 shadow-md'
        }`}
      >
        {!isOwn && message.senderId && (
          <div className="text-xs font-bold mb-2 flex items-center">
            <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-2 shadow-sm"></span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {message.senderId}
            </span>
          </div>
        )}
        
        {renderMessageContent()}
        
        <div className={`flex items-center mt-2 text-xs font-medium ${isOwn ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'} opacity-90`}>
          <span className="drop-shadow-sm">{formatDate(message.createdAt)}</span>
          {isOwn && (
            <span className="ml-2 flex items-center drop-shadow-sm">
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};