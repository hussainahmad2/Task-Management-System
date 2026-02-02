export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'location' | 'contact';
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  fileSize?: number;
  duration?: number;
  replyToMessageId?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  deletedForEveryone?: boolean;
  createdAt: Date;
  updatedAt: Date;
  reactions?: MessageReaction[];
  status?: MessageStatus[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface MessageStatus {
  id: string;
  messageId: string;
  userId: string;
  status: 'sent' | 'delivered' | 'read';
  deliveredAt?: Date;
  readAt?: Date;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: 'private' | 'group' | 'broadcast';
  avatarUrl?: string;
  description?: string;
  createdBy?: string;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
  participants: ChatRoomParticipant[];
  unreadCount?: number;
  lastMessage?: Message;
}

export interface ChatRoomParticipant {
  id: string;
  chatRoomId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  lastReadMessageId?: string;
}

export interface Call {
  id: string;
  chatRoomId?: string;
  callerId: string;
  calleeId?: string;
  callType: 'voice' | 'video';
  status: 'initiated' | 'ringing' | 'connected' | 'ended' | 'missed' | 'rejected';
  duration?: number;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  chatRoomId?: string;
  organizerId: string;
  scheduledFor: Date;
  duration: number; // in minutes
  meetingLink?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  userId: string;
  status: 'invited' | 'accepted' | 'declined' | 'attended';
  joinedAt?: Date;
  leftAt?: Date;
}

export interface StickerPack {
  id: string;
  name: string;
  creatorId?: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface Sticker {
  id: string;
  packId: string;
  name: string;
  imageUrl: string;
  emoji?: string;
  createdAt: Date;
}

export interface UserContact {
  id: string;
  userId: string;
  contactId: string;
  nickname?: string;
  isBlocked: boolean;
  createdAt: Date;
}