import Layout from "@/components/Layout";
import { useMessaging } from "@/contexts/MessagingContext";
import { ChatSidebar } from "@/components/messaging/ChatSidebar";
import { ChatHeader } from "@/components/messaging/ChatHeader";
import { MessageList } from "@/components/messaging/MessageList";
import { MessageInput } from "@/components/messaging/MessageInput";
import { StartNewChatModal } from "@/components/messaging/StartNewChatModal";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { ChatRoom } from "@/types/messaging";

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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const chatRooms = state.chatRooms;
  const messages = state.messages[activeChatRoom?.id || ""] || [];

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
        selectedUserNames || 'New Chat', // Use the user names as the chat name
        'private',
        selectedUserIds
      );
      
      // Refresh chat rooms list by re-initializing
      await actions.initialize();
      
      // Select the new chat room
      setActiveChatRoom(newChatRoom);
      actions.setActiveChatRoom(newChatRoom.id);
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

  return (
    <Layout>
      <div className="h-full flex gap-0">
        {/* Chat Sidebar */}
        <div className="w-80 border-r border-border bg-white/50 dark:bg-gray-800/50">
          <ChatSidebar
            chatRooms={chatRooms}
            activeChatRoomId={activeChatRoom?.id}
            onSelectChatRoom={handleSelectChatRoom}
            onCreateChat={handleCreateChat}
            className="h-full"
          />
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col border border-border bg-white dark:bg-gray-900">
          {activeChatRoom ? (
            <>
              <ChatHeader
                chatRoom={activeChatRoom}
                onBack={() => setActiveChatRoom(null)}
                className="bg-white/90 dark:bg-gray-800/90 border-b border-border"
              />
              <MessageList
                messages={messages}
                currentUserId={user?.id || "current-user"}
                className="flex-1 bg-white/50 dark:bg-gray-800/50"
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                onSendSticker={handleSendSticker}
                onSendEmoji={handleSendEmoji}
                className="bg-white/90 dark:bg-gray-800/90 border-t border-border"
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
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
    </Layout>
  );
}
