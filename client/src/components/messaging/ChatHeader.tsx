import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChatRoom } from '../../types/messaging';
import { Trash2, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  chatRoom: ChatRoom;
  onBack?: () => void;
  onInfo?: () => void;
  onDeleteChat?: () => void;
  showActions?: boolean;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatRoom,
  onBack,
  onInfo,
  onDeleteChat,
  showActions = true,
  className
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={cn("border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 flex items-center", className)}>
      {onBack && (
        <button
          onClick={onBack}
          className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      <div className="flex items-center flex-1">
        <div className="relative">
          {chatRoom.avatarUrl ? (
            <img
              src={chatRoom.avatarUrl}
              alt={chatRoom.name || 'Chat'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {chatRoom.name?.charAt(0).toUpperCase() || '#'}
            </div>
          )}
          {chatRoom.type !== 'private' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-300 rounded-full border-2 border-white dark:border-gray-800"></div>
          )}
        </div>
        
        <div className="ml-3">
          <div className="font-semibold text-gray-900 dark:text-white">
            {chatRoom.name || 'Chat'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {chatRoom.type === 'private' ? 'Online' : `${chatRoom.participants.length} members`}
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="flex space-x-2 items-center">
          <button
            onClick={onInfo}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Delete menu */}
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
                <button
                  onClick={() => {
                    onDeleteChat?.();
                    setMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};