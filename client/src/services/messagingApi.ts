import { ChatRoom, Message, Call, Meeting, UserContact, StickerPack, Sticker } from '../types/messaging';

// Base API service for messaging
const API_BASE_URL = '/api/messaging';

// Chat Rooms API
export const chatRoomsApi = {
  getAll: async (): Promise<ChatRoom[]> => {
    const response = await fetch(`${API_BASE_URL}/chat-rooms`);
    if (!response.ok) {
      throw new Error('Failed to fetch chat rooms');
    }
    return response.json();
  },

  getById: async (id: string): Promise<ChatRoom> => {
    const response = await fetch(`${API_BASE_URL}/chat-rooms/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chat room with id ${id}`);
    }
    return response.json();
  },

  create: async (data: Omit<ChatRoom, 'id' | 'createdAt' | 'updatedAt' | 'participants'>): Promise<ChatRoom> => {
    const response = await fetch(`${API_BASE_URL}/chat-rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create chat room');
    }
    return response.json();
  },

  update: async (id: string, data: Partial<ChatRoom>): Promise<ChatRoom> => {
    const response = await fetch(`${API_BASE_URL}/chat-rooms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update chat room with id ${id}`);
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chat-rooms/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete chat room with id ${id}`);
    }
  },
};

// Messages API
export const messagesApi = {
  getAll: async (chatRoomId: string): Promise<Message[]> => {
    const response = await fetch(`${API_BASE_URL}/chat-rooms/${chatRoomId}/messages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages for chat room ${chatRoomId}`);
    }
    return response.json();
  },

  getById: async (id: string): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch message with id ${id}`);
    }
    return response.json();
  },

  create: async (data: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return response.json();
  },

  update: async (id: string, data: Partial<Message>): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update message with id ${id}`);
    }
    return response.json();
  },

  delete: async (id: string, forEveryone: boolean = false): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}?forEveryone=${forEveryone}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete message with id ${id}`);
    }
  },
};

// Calls API
export const callsApi = {
  getAll: async (): Promise<Call[]> => {
    const response = await fetch(`${API_BASE_URL}/calls`);
    if (!response.ok) {
      throw new Error('Failed to fetch calls');
    }
    return response.json();
  },

  getById: async (id: string): Promise<Call> => {
    const response = await fetch(`${API_BASE_URL}/calls/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch call with id ${id}`);
    }
    return response.json();
  },

  create: async (data: Omit<Call, 'id' | 'createdAt'>): Promise<Call> => {
    const response = await fetch(`${API_BASE_URL}/calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to initiate call');
    }
    return response.json();
  },

  update: async (id: string, data: Partial<Call>): Promise<Call> => {
    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update call with id ${id}`);
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete call with id ${id}`);
    }
  },
};

// Meetings API
export const meetingsApi = {
  getAll: async (): Promise<Meeting[]> => {
    const response = await fetch(`${API_BASE_URL}/meetings`);
    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
    }
    return response.json();
  },

  getById: async (id: string): Promise<Meeting> => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch meeting with id ${id}`);
    }
    return response.json();
  },

  create: async (data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> => {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to schedule meeting');
    }
    return response.json();
  },

  update: async (id: string, data: Partial<Meeting>): Promise<Meeting> => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update meeting with id ${id}`);
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to cancel meeting with id ${id}`);
    }
  },
};

// Contacts API
export const contactsApi = {
  getAll: async (): Promise<UserContact[]> => {
    const response = await fetch(`${API_BASE_URL}/contacts`);
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return response.json();
  },

  getById: async (id: string): Promise<UserContact> => {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch contact with id ${id}`);
    }
    return response.json();
  },

  create: async (data: Omit<UserContact, 'id' | 'createdAt'>): Promise<UserContact> => {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to add contact');
    }
    return response.json();
  },

  update: async (id: string, data: Partial<UserContact>): Promise<UserContact> => {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update contact with id ${id}`);
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete contact with id ${id}`);
    }
  },
};

// Stickers API
export const stickersApi = {
  getPacks: async (): Promise<StickerPack[]> => {
    const response = await fetch(`${API_BASE_URL}/sticker-packs`);
    if (!response.ok) {
      throw new Error('Failed to fetch sticker packs');
    }
    return response.json();
  },

  getByPackId: async (packId: string): Promise<Sticker[]> => {
    const response = await fetch(`${API_BASE_URL}/sticker-packs/${packId}/stickers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stickers for pack ${packId}`);
    }
    return response.json();
  },

  getAllStickers: async (): Promise<Sticker[]> => {
    const response = await fetch(`${API_BASE_URL}/stickers`);
    if (!response.ok) {
      throw new Error('Failed to fetch all stickers');
    }
    return response.json();
  },
};