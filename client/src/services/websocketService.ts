import { Message, Call, Meeting } from '../types/messaging';

type MessageType = 
  | 'message'
  | 'message_delivered'
  | 'message_read'
  | 'call_initiated'
  | 'call_accepted'
  | 'call_rejected'
  | 'call_ended'
  | 'call_offer'
  | 'call_answer'
  | 'ice_candidate'
  | 'meeting_scheduled'
  | 'meeting_updated'
  | 'meeting_cancelled'
  | 'user_typing'
  | 'user_online'
  | 'user_offline'
  | 'ping'
  | 'pong'
  | 'auth'
  | 'auth_success'
  | 'connected'
  | 'subscribed'
  | 'subscribe'
  | 'unsubscribe';

interface WebSocketMessage {
  type: MessageType;
  payload: any;
  timestamp: Date;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectInterval = 5000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private url: string;
  private isConnecting = false;
  private connectionFailed = false;

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      return Promise.reject(new Error('Connection already in progress'));
    }
    
    // If we already failed, don't keep trying
    if (this.connectionFailed) {
      return Promise.resolve(); // Silently resolve - messaging will work without WebSocket
    }
    
    // If already connected, resolve immediately
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }
    
    this.isConnecting = true;
    
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        const timeout = setTimeout(() => {
          this.isConnecting = false;
          this.connectionFailed = true;
          if (this.ws) {
            this.ws.close();
          }
          resolve(); // Don't reject - just continue without WebSocket
        }, 5000);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.connectionFailed = false;
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
          clearTimeout(timeout);
          console.log('WebSocket disconnected');
          this.isConnecting = false;
          this.stopHeartbeat();
          // Only attempt reconnect if we previously had a successful connection
          if (!this.connectionFailed && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          console.warn('WebSocket connection failed - messaging will work without real-time updates');
          this.isConnecting = false;
          this.connectionFailed = true;
          resolve(); // Don't reject - continue without WebSocket
        };
      } catch (error) {
        console.warn('Failed to create WebSocket connection:', error);
        this.isConnecting = false;
        this.connectionFailed = true;
        resolve(); // Don't reject - continue without WebSocket
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
  authenticate(userId: string) {
    this.send('auth', { userId });
  }

  subscribeToRoom(chatRoomId: string) {
    this.send('subscribe', { chatRoomId });
  }

  unsubscribeFromRoom(chatRoomId: string) {
    this.send('unsubscribe', { chatRoomId });
  }

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
      targetUserId: calleeId,
      callType,
      chatRoomId,
      timestamp: new Date(),
    });
  }

  sendCallResponse(callId: string, accepted: boolean, targetUserId?: string) {
    this.send(accepted ? 'call_accepted' : 'call_rejected', {
      callId,
      targetUserId,
      timestamp: new Date(),
    });
  }

  sendCallEnded(callId: string, targetUserId?: string, duration?: number) {
    this.send('call_ended', {
      callId,
      targetUserId,
      duration,
      timestamp: new Date(),
    });
  }

  // WebRTC Signaling for voice/video calls
  sendCallOffer(targetUserId: string, offer: RTCSessionDescriptionInit, chatRoomId?: string) {
    this.send('call_offer', {
      targetUserId,
      offer,
      chatRoomId,
      timestamp: new Date(),
    });
  }

  sendCallAnswer(targetUserId: string, answer: RTCSessionDescriptionInit, chatRoomId?: string) {
    this.send('call_answer', {
      targetUserId,
      answer,
      chatRoomId,
      timestamp: new Date(),
    });
  }

  sendIceCandidate(targetUserId: string, candidate: RTCIceCandidate, chatRoomId?: string) {
    this.send('ice_candidate', {
      targetUserId,
      candidate,
      chatRoomId,
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

  // Reset connection state to allow retry
  reset() {
    this.disconnect();
    this.connectionFailed = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // Get connection status for debugging
  getStatus() {
    return {
      connected: this.isConnected(),
      connecting: this.isConnecting,
      failed: this.connectionFailed,
      reconnectAttempts: this.reconnectAttempts,
      url: this.url
    };
  }
}

// Create a singleton instance - use same host/port as the app
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}/ws`;
export const websocketService = new WebSocketService(wsUrl);

// Export types for convenience
export type { WebSocketMessage, MessageType };