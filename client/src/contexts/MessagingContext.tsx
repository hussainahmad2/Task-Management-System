import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  ChatRoom, 
  Message, 
  Call, 
  Meeting, 
  UserContact, 
  StickerPack, 
  Sticker 
} from '../types/messaging';
import { 
  chatRoomsApi, 
  messagesApi, 
  callsApi, 
  meetingsApi, 
  contactsApi, 
  stickersApi 
} from '../services/messagingApi';
import { websocketService } from '../services/websocketService';

// Define the state interface
interface MessagingState {
  chatRooms: ChatRoom[];
  messages: Record<string, Message[]>; // chatRoomId -> messages
  calls: Call[];
  meetings: Meeting[];
  contacts: UserContact[];
  stickerPacks: StickerPack[];
  stickers: Record<string, Sticker[]>; // packId -> stickers
  currentUser: string | null;
  activeChatRoom: string | null;
  isInitialized: boolean;
  isConnecting: boolean;
  unreadCount: number;
}

// Define action types
type MessagingAction =
  | { type: 'SET_INITIALIZED' }
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: string }
  | { type: 'SET_ACTIVE_CHAT_ROOM'; payload: string | null }
  | { type: 'SET_CHAT_ROOMS'; payload: ChatRoom[] }
  | { type: 'ADD_CHAT_ROOM'; payload: ChatRoom }
  | { type: 'UPDATE_CHAT_ROOM'; payload: ChatRoom }
  | { type: 'REMOVE_CHAT_ROOM'; payload: string }
  | { type: 'SET_MESSAGES'; payload: { chatRoomId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'REMOVE_MESSAGE'; payload: string }
  | { type: 'SET_CALLS'; payload: Call[] }
  | { type: 'ADD_CALL'; payload: Call }
  | { type: 'UPDATE_CALL'; payload: Call }
  | { type: 'REMOVE_CALL'; payload: string }
  | { type: 'SET_MEETINGS'; payload: Meeting[] }
  | { type: 'ADD_MEETING'; payload: Meeting }
  | { type: 'UPDATE_MEETING'; payload: Meeting }
  | { type: 'REMOVE_MEETING'; payload: string }
  | { type: 'SET_CONTACTS'; payload: UserContact[] }
  | { type: 'ADD_CONTACT'; payload: UserContact }
  | { type: 'UPDATE_CONTACT'; payload: UserContact }
  | { type: 'REMOVE_CONTACT'; payload: string }
  | { type: 'SET_STICKER_PACKS'; payload: StickerPack[] }
  | { type: 'SET_STICKERS_FOR_PACK'; payload: { packId: string; stickers: Sticker[] } }
  | { type: 'MARK_MESSAGES_AS_READ'; payload: { chatRoomId: string } };

// Initial state
const initialState: MessagingState = {
  chatRooms: [],
  messages: {},
  calls: [],
  meetings: [],
  contacts: [],
  stickerPacks: [],
  stickers: {},
  currentUser: null,
  activeChatRoom: null,
  isInitialized: false,
  isConnecting: false,
  unreadCount: 0,
};

// Reducer function
const calculateUnreadCount = (chatRooms: ChatRoom[]): number => {
  return chatRooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
};

const messagingReducer = (state: MessagingState, action: MessagingAction): MessagingState => {
  switch (action.type) {
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: true };
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ACTIVE_CHAT_ROOM':
      return { ...state, activeChatRoom: action.payload };
    case 'SET_CHAT_ROOMS':
      return { ...state, chatRooms: action.payload, unreadCount: calculateUnreadCount(action.payload) };
    case 'ADD_CHAT_ROOM':
      const newChatRooms = [...state.chatRooms, action.payload];
      return { 
        ...state, 
        chatRooms: newChatRooms,
        unreadCount: calculateUnreadCount(newChatRooms),
      };
    case 'UPDATE_CHAT_ROOM':
      const updatedChatRooms = state.chatRooms.map(room => 
        room.id === action.payload.id ? action.payload : room
      );
      return {
        ...state,
        chatRooms: updatedChatRooms,
        unreadCount: calculateUnreadCount(updatedChatRooms),
      };
    case 'REMOVE_CHAT_ROOM':
      const filteredChatRooms = state.chatRooms.filter(room => room.id !== action.payload);
      return {
        ...state,
        chatRooms: filteredChatRooms,
        unreadCount: calculateUnreadCount(filteredChatRooms),
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatRoomId]: action.payload.messages,
        },
      };
    case 'ADD_MESSAGE':
      // Check if message already exists to prevent duplicates
      const existingMessages = state.messages[action.payload.chatRoomId] || [];
      const messageExists = existingMessages.some(
        (msg: Message) => msg.id === action.payload.id || 
          (msg.content === action.payload.content && 
           msg.senderId === action.payload.senderId &&
           Math.abs(new Date(msg.createdAt || 0).getTime() - new Date(action.payload.createdAt || 0).getTime()) < 5000)
      );
      
      if (messageExists) {
        return state;
      }
      
      const updatedMessages = {
        ...state.messages,
        [action.payload.chatRoomId]: [
          ...existingMessages,
          action.payload,
        ],
      };
      // Update the chat room's unread count if it's not from the current user
      const updatedChatRoomsForMessage = state.chatRooms.map(room => {
        if (room.id === action.payload.chatRoomId && action.payload.senderId !== state.currentUser) {
          return {
            ...room,
            unreadCount: (room.unreadCount || 0) + 1
          };
        }
        return room;
      });
      return {
        ...state,
        messages: updatedMessages,
        chatRooms: updatedChatRoomsForMessage,
        unreadCount: calculateUnreadCount(updatedChatRoomsForMessage),
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatRoomId]: state.messages[action.payload.chatRoomId]?.map(msg =>
            msg.id === action.payload.id ? action.payload : msg
          ) || [],
        },
      };
    case 'REMOVE_MESSAGE':
      return {
        ...state,
        messages: Object.keys(state.messages).reduce((acc, chatRoomId) => {
          acc[chatRoomId] = state.messages[chatRoomId].filter(msg => msg.id !== action.payload);
          return acc;
        }, {} as Record<string, Message[]>),
      };
    case 'SET_CALLS':
      return { ...state, calls: action.payload };
    case 'ADD_CALL':
      return { ...state, calls: [...state.calls, action.payload] };
    case 'UPDATE_CALL':
      return {
        ...state,
        calls: state.calls.map(call =>
          call.id === action.payload.id ? action.payload : call
        ),
      };
    case 'REMOVE_CALL':
      return {
        ...state,
        calls: state.calls.filter(call => call.id !== action.payload),
      };
    case 'SET_MEETINGS':
      return { ...state, meetings: action.payload };
    case 'ADD_MEETING':
      return { ...state, meetings: [...state.meetings, action.payload] };
    case 'UPDATE_MEETING':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.id ? action.payload : meeting
        ),
      };
    case 'REMOVE_MEETING':
      return {
        ...state,
        meetings: state.meetings.filter(meeting => meeting.id !== action.payload),
      };
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
      };
    case 'REMOVE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload),
      };
    case 'SET_STICKER_PACKS':
      return { ...state, stickerPacks: action.payload };
    case 'SET_STICKERS_FOR_PACK':
      return {
        ...state,
        stickers: {
          ...state.stickers,
          [action.payload.packId]: action.payload.stickers,
        },
      };
    case 'MARK_MESSAGES_AS_READ':
      const { chatRoomId } = action.payload as { chatRoomId: string };
      const updatedChatRoomsWithRead = state.chatRooms.map(room => {
        if (room.id === chatRoomId) {
          return {
            ...room,
            unreadCount: 0
          };
        }
        return room;
      });
      return {
        ...state,
        chatRooms: updatedChatRoomsWithRead,
        unreadCount: calculateUnreadCount(updatedChatRoomsWithRead),
      };
    
    default:
      return state;
  }
};

// Create context
interface MessagingContextType {
  state: MessagingState;
  actions: {
    initialize: () => Promise<void>;
    setCurrentUser: (userId: string) => void;
    setActiveChatRoom: (chatRoomId: string | null) => void;
    createChatRoom: (name: string, type: 'private' | 'group' | 'broadcast', participants?: string[]) => Promise<ChatRoom>;
    sendMessage: (chatRoomId: string, content: string, messageType?: 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'location' | 'contact', mediaUrl?: string) => Promise<Message>;
    makeCall: (calleeId: string, callType: 'voice' | 'video', chatRoomId?: string) => Promise<Call>;
    scheduleMeeting: (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Meeting>;
    addContact: (contactData: Omit<UserContact, 'id' | 'createdAt'>) => Promise<UserContact>;
    markMessagesAsRead: (chatRoomId: string) => void;
  };
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

// Provider component
interface MessagingProviderProps {
  children: ReactNode;
  currentUser?: string;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children, currentUser }) => {
  const [state, dispatch] = useReducer(messagingReducer, {
    ...initialState,
    currentUser: currentUser || null,
  });

  // Initialize the messaging system
  const initialize = async () => {
    try {
      dispatch({ type: 'SET_CONNECTING', payload: true });
      
      // Try to connect to WebSocket (non-blocking - messaging works without it)
      try {
        await websocketService.connect();
        // Authenticate with user ID if connected
        if (state.currentUser && websocketService.isConnected()) {
          websocketService.authenticate(state.currentUser);
        }
      } catch (wsError) {
        console.warn('WebSocket unavailable - messaging will work without real-time updates');
      }
      
      // Fetch initial data - this is required
      const [chatRooms, calls, meetings, contacts, stickerPacks] = await Promise.all([
        chatRoomsApi.getAll().catch(() => []),
        callsApi.getAll().catch(() => []),
        meetingsApi.getAll().catch(() => []),
        contactsApi.getAll().catch(() => []),
        stickersApi.getPacks().catch(() => []),
      ]);
      
      dispatch({ type: 'SET_CHAT_ROOMS', payload: chatRooms });
      dispatch({ type: 'SET_CALLS', payload: calls });
      dispatch({ type: 'SET_MEETINGS', payload: meetings });
      dispatch({ type: 'SET_CONTACTS', payload: contacts });
      dispatch({ type: 'SET_STICKER_PACKS', payload: stickerPacks });
      
      // Preload stickers for each pack
      for (const pack of stickerPacks) {
        try {
          const stickers = await stickersApi.getByPackId(pack.id);
          dispatch({ type: 'SET_STICKERS_FOR_PACK', payload: { packId: pack.id, stickers } });
        } catch (err) {
          console.error(`Failed to load stickers for pack ${pack.id}:`, err);
        }
      }
      
      dispatch({ type: 'SET_INITIALIZED' });
    } catch (error) {
      console.error('Failed to initialize messaging system:', error);
    } finally {
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  };

  // Set up WebSocket event listeners
  useEffect(() => {
    if (state.isInitialized) {
      // Listen for incoming messages
      const unsubscribeMessage = websocketService.subscribe('message', (payload) => {
        dispatch({ type: 'ADD_MESSAGE', payload });
      });

      // Listen for call events
      const unsubscribeCallInitiated = websocketService.subscribe('call_initiated', (payload) => {
        dispatch({ type: 'ADD_CALL', payload: { ...payload, status: 'initiated' } });
      });

      const unsubscribeCallAccepted = websocketService.subscribe('call_accepted', (payload) => {
        dispatch({ type: 'UPDATE_CALL', payload: { ...payload, status: 'connected' } });
      });

      const unsubscribeCallRejected = websocketService.subscribe('call_rejected', (payload) => {
        dispatch({ type: 'UPDATE_CALL', payload: { ...payload, status: 'rejected' } });
      });

      const unsubscribeCallEnded = websocketService.subscribe('call_ended', (payload) => {
        dispatch({ type: 'UPDATE_CALL', payload: { ...payload, status: 'ended' } });
      });

      // Listen for meeting events
      const unsubscribeMeetingScheduled = websocketService.subscribe('meeting_scheduled', (payload) => {
        dispatch({ type: 'ADD_MEETING', payload });
      });

      const unsubscribeMeetingUpdated = websocketService.subscribe('meeting_updated', (payload) => {
        // Update meeting in state
        const updatedMeeting = { ...state.meetings.find(m => m.id === payload.meetingId), ...payload.updates };
        dispatch({ type: 'UPDATE_MEETING', payload: updatedMeeting });
      });

      const unsubscribeMeetingCancelled = websocketService.subscribe('meeting_cancelled', (payload) => {
        const meeting = state.meetings.find(m => m.id === payload.meetingId);
        if (meeting) {
          const updatedMeeting: Meeting = { ...meeting, status: 'cancelled' };
          dispatch({ type: 'UPDATE_MEETING', payload: updatedMeeting });
        }
      });

      return () => {
        unsubscribeMessage();
        unsubscribeCallInitiated();
        unsubscribeCallAccepted();
        unsubscribeCallRejected();
        unsubscribeCallEnded();
        unsubscribeMeetingScheduled();
        unsubscribeMeetingUpdated();
        unsubscribeMeetingCancelled();
      };
    }
  }, [state.isInitialized]);

  // Load messages for active chat room and subscribe to WebSocket
  useEffect(() => {
    if (state.activeChatRoom) {
      const loadMessages = async () => {
        try {
          if (state.activeChatRoom) {
            const messages = await messagesApi.getAll(state.activeChatRoom);
            dispatch({ type: 'SET_MESSAGES', payload: { chatRoomId: state.activeChatRoom, messages } });
          }
        } catch (error) {
          console.error(`Failed to load messages for chat room ${state.activeChatRoom}:`, error);
        }
      };

      loadMessages();
      
      // Subscribe to the chat room for real-time updates
      if (websocketService.isConnected()) {
        websocketService.subscribeToRoom(state.activeChatRoom);
      }
      
      // Cleanup: unsubscribe when chat room changes
      return () => {
        if (state.activeChatRoom && websocketService.isConnected()) {
          websocketService.unsubscribeFromRoom(state.activeChatRoom);
        }
      };
    }
  }, [state.activeChatRoom]);

  const setCurrentUser = (userId: string) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: userId });
  };

  const setActiveChatRoom = (chatRoomId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CHAT_ROOM', payload: chatRoomId });
  };

  const createChatRoom = async (
    name: string,
    type: 'private' | 'group' | 'broadcast',
    participants: string[] = []
  ): Promise<ChatRoom> => {
    try {
      const newChatRoom = await chatRoomsApi.create({
        name,
        type,
      });

      dispatch({ type: 'ADD_CHAT_ROOM', payload: newChatRoom });
      return newChatRoom;
    } catch (error) {
      console.error('Failed to create chat room:', error);
      throw error;
    }
  };

  const sendMessage = async (
    chatRoomId: string,
    content: string,
    messageType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'location' | 'contact' = 'text',
    mediaUrl?: string
  ): Promise<Message> => {
    try {
      const newMessage = await messagesApi.create({
        chatRoomId,
        senderId: state.currentUser || 'unknown',
        messageType,
        content,
        mediaUrl,
      });

      // Send via WebSocket for real-time delivery
      websocketService.sendMessage(content, chatRoomId, state.currentUser || 'unknown', messageType, mediaUrl);

      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const makeCall = async (
    calleeId: string,
    callType: 'voice' | 'video',
    chatRoomId?: string
  ): Promise<Call> => {
    try {
      const newCall = await callsApi.create({
        callerId: state.currentUser || 'unknown',
        calleeId,
        callType,
        status: 'initiated',
        chatRoomId,
      });

      // Send call initiation via WebSocket
      websocketService.sendCallInitiation(
        state.currentUser || 'unknown',
        calleeId,
        callType,
        chatRoomId
      );

      dispatch({ type: 'ADD_CALL', payload: newCall });
      return newCall;
    } catch (error) {
      console.error('Failed to initiate call:', error);
      throw error;
    }
  };

  const scheduleMeeting = async (
    meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Meeting> => {
    try {
      const newMeeting = await meetingsApi.create(meetingData);

      // Send meeting scheduled event via WebSocket
      websocketService.sendMeetingScheduled(meetingData);

      dispatch({ type: 'ADD_MEETING', payload: newMeeting });
      return newMeeting;
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
      throw error;
    }
  };

  const addContact = async (
    contactData: Omit<UserContact, 'id' | 'createdAt'>
  ): Promise<UserContact> => {
    try {
      const newContact = await contactsApi.create(contactData);
      dispatch({ type: 'ADD_CONTACT', payload: newContact });
      return newContact;
    } catch (error) {
      console.error('Failed to add contact:', error);
      throw error;
    }
  };

  const markMessagesAsRead = (chatRoomId: string) => {
    dispatch({ type: 'MARK_MESSAGES_AS_READ', payload: { chatRoomId } });
  };

  const value = {
    state,
    actions: {
      initialize,
      setCurrentUser,
      setActiveChatRoom,
      createChatRoom,
      sendMessage,
      makeCall,
      scheduleMeeting,
      addContact,
      markMessagesAsRead,
    },
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

// Custom hook to use the messaging context
export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};