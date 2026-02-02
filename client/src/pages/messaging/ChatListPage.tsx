import React, { useState, useEffect } from 'react';
import { ChatSidebar } from '../../components/messaging/ChatSidebar';
import { ChatHeader } from '../../components/messaging/ChatHeader';
import { MessageList } from '../../components/messaging/MessageList';
import { MessageInput } from '../../components/messaging/MessageInput';
import { ChatRoom, Message, User } from '../../types/messaging';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../hooks/use-auth';

const ChatListPage: React.FC = () => {
  const { state, actions } = useMessaging();
  const { user } = useAuth();
  
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  // Use real data from context
  const chatRooms = state.chatRooms;
  const messages = state.messages[activeChatRoom?.id || ''] || [];
  
  // Set current user when available
  useEffect(() => {
    if (user?.id) {
      actions.setCurrentUser(user.id);
    }
  }, [user?.id, actions]);

  const handleSelectChatRoom = (chatRoomId: string) => {
    const room = chatRooms.find(room => room.id === chatRoomId);
    if (room) {
      setActiveChatRoom(room);
      actions.setActiveChatRoom(chatRoomId);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChatRoom || !user?.id) return;
    
    try {
      await actions.sendMessage(activeChatRoom.id, content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendSticker = async (stickerId: string) => {
    if (!activeChatRoom || !user?.id) return;
    
    try {
      // In a real implementation, you'd get the sticker URL from the sticker ID
      const stickerUrl = `/api/stickers/${stickerId}`;
      await actions.sendMessage(activeChatRoom.id, '', 'sticker', stickerUrl);
    } catch (error) {
      console.error('Failed to send sticker:', error);
    }
  };

  const handleSendEmoji = async (emoji: string) => {
    if (!activeChatRoom || !user?.id) return;
    
    try {
      await actions.sendMessage(activeChatRoom.id, emoji, 'text');
    } catch (error) {
      console.error('Failed to send emoji:', error);
    }
  };

  return (
    <div className="flex h-full">
      <ChatSidebar
        chatRooms={chatRooms}
        activeChatRoomId={activeChatRoom?.id}
        onSelectChatRoom={handleSelectChatRoom}
        onCreateChat={() => setShowCreateGroup(true)}
      />
      
      {activeChatRoom ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader
            chatRoom={activeChatRoom}
            onBack={() => setActiveChatRoom(null)}
          />
          <MessageList
            messages={messages}
            currentUserId="current-user"
          />
          <MessageInput
            onSendMessage={handleSendMessage}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No conversation selected</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Select a chat from the list to start messaging
            </p>
          </div>
        </div>
      )}
      
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create Group Chat
                </h2>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This is where the group creation form would appear.
              </p>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatListPage;