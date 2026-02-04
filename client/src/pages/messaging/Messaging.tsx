import Layout from "@/components/Layout";
import { useMessaging } from "@/contexts/MessagingContext";
import { ChatSidebar } from "@/components/messaging/ChatSidebar";
import { ChatHeader } from "@/components/messaging/ChatHeader";
import { MessageList } from "@/components/messaging/MessageList";
import { MessageInput } from "@/components/messaging/MessageInput";
import { StartNewChatModal } from "@/components/messaging/StartNewChatModal";
import { UserProfileSidebar } from "@/components/messaging/UserProfileSidebar";
import { VoiceCall } from "@/components/messaging/VoiceCall";
import { VideoCall } from "@/components/messaging/VideoCall";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { ChatRoom, Call } from "@/types/messaging";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  role: string;
}

export default function MessagingPage() {
  const { user } = useAuth();
  const { state, actions } = useMessaging();
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const initializingRef = useRef(false);

  const chatRooms = state.chatRooms;
  const messages = state.messages[activeChatRoom?.id ? String(activeChatRoom.id) : ""] || [];

  // Initialize messaging system on component mount (only once)
  useEffect(() => {
    if (user?.id && !state.isInitialized && !initializingRef.current) {
      initializingRef.current = true;
      actions.setCurrentUser(user.id);
      actions.initialize()
        .catch((err) => console.warn("Messaging initialization issue:", err))
        .finally(() => {
          // Allow retry after some time if still not initialized
          setTimeout(() => { initializingRef.current = false; }, 30000);
        });
    }
  }, [user?.id, state.isInitialized]);

  // Fetch users for new chat modal
  useEffect(() => {
    if (showNewChatModal && user?.id) {
      setIsLoadingUsers(true);
      fetch("/api/users")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.users) {
            // Filter out current user
            const filtered = data.users.filter((u: User) => u.id !== user.id);
            setUsers(filtered);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch users:", err);
          setUsers([]);
        })
        .finally(() => setIsLoadingUsers(false));
    }
  }, [showNewChatModal, user?.id]);

  const handleSelectChatRoom = (chatRoomId: string) => {
    const room = chatRooms.find((room) => room.id === chatRoomId);
    if (room) {
      setActiveChatRoom(room);
      actions.setActiveChatRoom(chatRoomId);
      actions.markMessagesAsRead(chatRoomId);
    }
  };

  const handleCreateChat = () => {
    setShowNewChatModal(true);
  };

  const handleStartChat = async (selectedUserIds: string[]) => {
    if (!user?.id || selectedUserIds.length === 0) return;

    try {
      // Create a private chat room with selected users
      // Generate a name from the selected users
      const selectedUserNames = users
        .filter((u) => selectedUserIds.includes(u.id))
        .map((u) => `${u.firstName} ${u.lastName}`)
        .join(', ');
      
      const newChatRoom = await actions.createChatRoom(
        selectedUserNames || 'New Chat',
        'private',
        selectedUserIds
      );
      
      // Close modal and immediately open the chat
      setShowNewChatModal(false);
      setActiveChatRoom(newChatRoom);
      actions.setActiveChatRoom(String(newChatRoom.id));
      
      // Refresh chat rooms list
      await actions.initialize();
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChatRoom || !user?.id) return;

    try {
      await actions.sendMessage(activeChatRoom.id, content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSendSticker = async (stickerId: string) => {
    if (!activeChatRoom || !user?.id) return;

    try {
      const stickerUrl = `/api/stickers/${stickerId}`;
      await actions.sendMessage(activeChatRoom.id, "", "sticker", stickerUrl);
    } catch (error) {
      console.error("Failed to send sticker:", error);
    }
  };

  const handleSendEmoji = async (emoji: string) => {
    if (!activeChatRoom || !user?.id) return;

    try {
      await actions.sendMessage(activeChatRoom.id, emoji, "text");
    } catch (error) {
      console.error("Failed to send emoji:", error);
    }
  };

  const handleDeleteChat = async (chatRoomId: string) => {
    if (!chatRoomId) return;
    try {
      await fetch(`/api/messaging/chat-rooms/${chatRoomId}`, { method: 'DELETE' });
      if (activeChatRoom?.id === chatRoomId) {
        setActiveChatRoom(null);
      }
      await actions.initialize();
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!messageId) return;
    try {
      await fetch(`/api/messaging/messages/${messageId}`, { method: 'DELETE' });
      if (activeChatRoom) {
        actions.setActiveChatRoom(activeChatRoom.id);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex bg-gray-50 dark:bg-gray-900 -mx-6 -mt-6">
        {/* Chat Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
          <ChatSidebar
            chatRooms={chatRooms.filter((room, index, self) => 
              // Remove duplicates by name and filter out current user's own chat
              index === self.findIndex(r => r.name === room.name) &&
              room.name?.toLowerCase() !== `${user?.firstName} ${user?.lastName}`.toLowerCase()
            )}
            activeChatRoomId={activeChatRoom?.id?.toString()}
            onSelectChatRoom={handleSelectChatRoom}
            onCreateChat={handleCreateChat}
            onDeleteChat={handleDeleteChat}
            className="h-full"
          />
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {activeChatRoom ? (
            <>
              <ChatHeader
                chatRoom={activeChatRoom}
                onBack={() => setActiveChatRoom(null)}
                onDeleteChat={() => handleDeleteChat(activeChatRoom.id)}
                onVoiceCall={() => setShowVoiceCall(true)}
                onVideoCall={() => setShowVideoCall(true)}
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
              />
              <MessageList
                messages={messages}
                currentUserId={user?.id || "current-user"}
                onDeleteMessage={handleDeleteMessage}
                className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900"
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendSticker={handleSendSticker}
                onSendEmoji={handleSendEmoji}
                className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
              />
            </>
          ) : (
            <div 
              className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 cursor-pointer"
              onClick={() => setShowUserProfile(true)}
            >
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to Messages
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                  Select a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start New Chat Modal */}
      <StartNewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onStartChat={handleStartChat}
        users={users}
        isLoading={isLoadingUsers}
      />
      
      {/* User Profile Sidebar */}
      <UserProfileSidebar
        user={{
          id: user?.id || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          username: user?.username || '',
          email: user?.email || '',
          profileImageUrl: user?.profileImageUrl || undefined,
          role: user?.role || ''
        }}
        isVisible={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
      
      {/* Voice Call Component */}
      {showVoiceCall && (
        <VoiceCall
          call={{
            id: 'temp-voice-call',
            chatRoomId: activeChatRoom?.id,
            callerId: user?.id || 'current-user',
            callType: 'voice',
            status: 'ringing',
            createdAt: new Date(),
          }}
          onEndCall={() => setShowVoiceCall(false)}
          onAcceptCall={() => console.log('Voice call accepted')}
          onRejectCall={() => setShowVoiceCall(false)}
        />
      )}
      
      {/* Video Call Component */}
      {showVideoCall && (
        <VideoCall
          call={{
            id: 'temp-video-call',
            chatRoomId: activeChatRoom?.id,
            callerId: user?.id || 'current-user',
            callType: 'video',
            status: 'ringing',
            createdAt: new Date(),
          }}
          onEndCall={() => setShowVideoCall(false)}
          onAcceptCall={() => console.log('Video call accepted')}
          onRejectCall={() => setShowVideoCall(false)}
        />
      )}
    </Layout>
  );
}
