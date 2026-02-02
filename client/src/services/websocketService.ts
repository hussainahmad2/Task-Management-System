import { Message, Call, Meeting } from '../types/messaging';

type MessageType = 
  | 'message'
  | 'message_delivered'
  | 'message_read'
  | 'call_initiated'
  | 'call_accepted'
  | 'call_rejected'
  | 'call_ended'
  | 'meeting_scheduled'
  | 'meeting_updated'
  | 'meeting_cancelled'
  | 'user_typing'
  | 'user_online'
  | 'user_offline'
  | 'ping'
  | 'pong';

interface WebSocketMessage {
  type: MessageType;
  payload: any;
  timestamp: Date;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.stopHeartbeat();
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendHeartbeat();
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  private sendHeartbeat() {
    this.send('ping', {});
  }

  private handleMessage(message: WebSocketMessage) {
    // Check for heartbeat response
    if (message.type === 'pong') {
      if (this.heartbeatTimeout) {
        clearTimeout(this.heartbeatTimeout);
      }
      return;
    }

    // Trigger listeners for this message type
    const listeners = this.listeners.get(message.type) || [];
    listeners.forEach(listener => {
      try {
        listener(message.payload);
      } catch (error) {
        console.error(`Error in listener for ${message.type}:`, error);
      }
    });
  }

  send(type: MessageType, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  subscribe(type: MessageType, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    const listeners = this.listeners.get(type)!;
    listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const updatedListeners = listeners.filter(l => l !== callback);
      this.listeners.set(type, updatedListeners);
    };
  }

  // Convenience methods for common events
  sendMessage(content: string, chatRoomId: string, senderId: string, messageType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'location' | 'contact' = 'text', mediaUrl?: string) {
    this.send('message', {
      content,
      chatRoomId,
      senderId,
      messageType,
      mediaUrl,
      timestamp: new Date(),
    });
  }

  sendCallInitiation(callerId: string, calleeId: string, callType: 'voice' | 'video', chatRoomId?: string) {
    this.send('call_initiated', {
      callerId,
      calleeId,
      callType,
      chatRoomId,
      timestamp: new Date(),
    });
  }

  sendCallResponse(callId: string, accepted: boolean) {
    this.send(accepted ? 'call_accepted' : 'call_rejected', {
      callId,
      timestamp: new Date(),
    });
  }

  sendCallEnded(callId: string, duration?: number) {
    this.send('call_ended', {
      callId,
      duration,
      timestamp: new Date(),
    });
  }

  sendMeetingScheduled(meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) {
    this.send('meeting_scheduled', {
      meeting,
      timestamp: new Date(),
    });
  }

  sendMeetingUpdated(meetingId: string, updates: Partial<Meeting>) {
    this.send('meeting_updated', {
      meetingId,
      updates,
      timestamp: new Date(),
    });
  }

  sendMeetingCancelled(meetingId: string) {
    this.send('meeting_cancelled', {
      meetingId,
      timestamp: new Date(),
    });
  }

  sendTypingIndicator(chatRoomId: string, userId: string) {
    this.send('user_typing', {
      chatRoomId,
      userId,
      timestamp: new Date(),
    });
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Create a singleton instance
const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
export const websocketService = new WebSocketService(wsUrl);

// Export types for convenience
export type { WebSocketMessage, MessageType };