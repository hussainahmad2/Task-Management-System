import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChatRoom } from '../../types/messaging';
import { Trash2, MoreVertical } from 'lucide-react';

interface ChatSidebarProps {
  chatRooms: ChatRoom[];
  activeChatRoomId?: string;
  onSelectChatRoom: (chatRoomId: string) => void;
  onCreateChat?: () => void;
  onDeleteChat?: (chatRoomId: string) => void;
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatRooms,
  activeChatRoomId,
  onSelectChatRoom,
  onCreateChat,
  onDeleteChat,
  className
}) => {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  return (
    <div className={cn("w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full", className)}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chats</h2>
          <button
            onClick={onCreateChat}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((chatRoom) => (
          <div
            key={chatRoom.id}
            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
              activeChatRoomId === chatRoom.id
                ? 'bg-primary/10 border-l-4 border-l-primary'
                : ''
            }`}
          >
            <div className="flex items-center" onClick={() => onSelectChatRoom(chatRoom.id)}>
              <div className="relative">
                {chatRoom.avatarUrl ? (
                  <img
                    src={chatRoom.avatarUrl}
                    alt={chatRoom.name || 'Chat'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {chatRoom.name?.charAt(0).toUpperCase() || '#'}
                  </div>
                )}
                {chatRoom.type === 'private' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {chatRoom.name || 'Chat'}
                  </h3>
                  {chatRoom.lastMessage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(chatRoom.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  {chatRoom.lastMessage ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chatRoom.lastMessage.content || chatRoom.lastMessage.messageType}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500">No messages yet</p>
                  )}
                  
                  {chatRoom.unreadCount && chatRoom.unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {chatRoom.unreadCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <div className="relative ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === chatRoom.id ? null : chatRoom.id);
                  }}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen === chatRoom.id && (
                  <div className="absolute right-0 top-6 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat?.(chatRoom.id);
                        setMenuOpen(null);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};