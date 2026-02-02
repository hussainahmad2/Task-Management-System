import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { ChatHeader } from '../../components/messaging/ChatHeader';
import { MessageList } from '../../components/messaging/MessageList';
import { MessageInput } from '../../components/messaging/MessageInput';
import { ChatRoom, Message } from '../../types/messaging';

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching chat room and messages
    setTimeout(() => {
      setChatRoom({
        id: id || '1',
        name: id ? `Chat Room ${id}` : 'Chat Room',
        type: 'private',
        avatarUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [
          { id: 'p1', chatRoomId: id || '1', userId: 'user1', role: 'member', joinedAt: new Date() },
          { id: 'p2', chatRoomId: id || '1', userId: 'user2', role: 'member', joinedAt: new Date() },
        ],
      });

      setMessages([
        {
          id: 'm1',
          chatRoomId: id || '1',
          senderId: 'user1',
          messageType: 'text',
          content: 'Hello there!',
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3600000),
        },
        {
          id: 'm2',
          chatRoomId: id || '1',
          senderId: 'user2',
          messageType: 'text',
          content: 'Hi! How are you doing?',
          createdAt: new Date(Date.now() - 1800000),
          updatedAt: new Date(Date.now() - 1800000),
        },
        {
          id: 'm3',
          chatRoomId: id || '1',
          senderId: 'user1',
          messageType: 'text',
          content: 'I\'m doing great! Thanks for asking.',
          createdAt: new Date(Date.now() - 900000),
          updatedAt: new Date(Date.now() - 900000),
        },
      ]);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSendMessage = (content: string) => {
    if (!chatRoom) return;
    
    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      chatRoomId: chatRoom.id,
      senderId: 'current-user',
      messageType: 'text',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setMessages([...messages, newMessage]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Chat room not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader chatRoom={chatRoom} />
      <MessageList
        messages={messages}
        currentUserId="current-user"
      />
      <MessageInput
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatPage;