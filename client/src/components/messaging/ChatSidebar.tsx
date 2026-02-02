import React from 'react';
import { cn } from '@/lib/utils';
import { ChatRoom } from '../../types/messaging';

interface ChatSidebarProps {
  chatRooms: ChatRoom[];
  activeChatRoomId?: string;
  onSelectChatRoom: (chatRoomId: string) => void;
  onCreateChat?: () => void;
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatRooms,
  activeChatRoomId,
  onSelectChatRoom,
  onCreateChat,
  className
}) => {
  return (
    <div className={cn("w-80 border-r border-purple-200 dark:border-purple-800 bg-gradient-to-b from-white to-purple-50/20 dark:from-gray-800 dark:to-gray-900/50 flex flex-col h-full shadow-lg", className)}>
      <div className="p-4 border-b border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Chats</h2>
          <button
            onClick={onCreateChat}
            className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-500 dark:text-purple-400 transition-colors duration-200 hover:scale-110 transform"
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
            className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-3 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-200 shadow-sm"
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
            onClick={() => onSelectChatRoom(chatRoom.id)}
            className={`p-4 border-b border-purple-100 dark:border-purple-900/30 cursor-pointer transition-all duration-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:scale-[1.02] transform ${
              activeChatRoomId === chatRoom.id
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-l-purple-500'
                : ''
            }`}
          >
            <div className="flex items-center">
              <div className="relative">
                {chatRoom.avatarUrl ? (
                  <img
                    src={chatRoom.avatarUrl}
                    alt={chatRoom.name || 'Chat'}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-300 dark:ring-purple-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {chatRoom.name?.charAt(0).toUpperCase() || '#'}
                  </div>
                )}
                {chatRoom.type === 'private' && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                )}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate italic">
                      {chatRoom.lastMessage.content || chatRoom.lastMessage.messageType}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No messages yet</p>
                  )}
                  
                  {chatRoom.unreadCount && chatRoom.unreadCount > 0 && (
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                      {chatRoom.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};