import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import type { IncomingMessage } from "http";

interface UserConnection {
  ws: WebSocket;
  userId: string;
  subscribedRooms: Set<string>;
  lastPing: number;
  isAlive: boolean;
}

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp?: string;
}

class WebSocketManager {
  private wss: WebSocketServer;
  private connections: Map<WebSocket, UserConnection> = new Map();
  private roomSubscriptions: Map<string, Set<WebSocket>> = new Map();
  private userToSocket: Map<string, WebSocket> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.setupEventHandlers();
    this.startHeartbeat();
    this.startCleanup();
  }

  // Attach to HTTP server
  attachToServer(httpServer: Server) {
    httpServer.on("upgrade", (request, socket, head) => {
      const pathname = request.url?.split("?")[0];
      
      if (pathname === "/ws") {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit("connection", ws, request);
        });
      }
      // Let other paths (like /vite-hmr) pass through
    });
    
    console.log("WebSocket manager attached to server");
  }

  private setupEventHandlers() {
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      console.log(`WebSocket client connected (Total: ${this.wss.clients.size})`);
      
      // Initialize connection state
      const connection: UserConnection = {
        ws,
        userId: "",
        subscribedRooms: new Set(),
        lastPing: Date.now(),
        isAlive: true
      };
      this.connections.set(ws, connection);

      // Send welcome message with server time
      this.sendTo(ws, { type: "connected", payload: { serverTime: new Date().toISOString() } });

      ws.on("message", (data) => this.handleMessage(ws, data));
      ws.on("close", () => this.handleClose(ws));
      ws.on("error", (error) => this.handleError(ws, error));
      ws.on("pong", () => this.handlePong(ws));
    });
  }

  private handleMessage(ws: WebSocket, data: any) {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      const connection = this.connections.get(ws);
      if (!connection) return;

      connection.lastPing = Date.now();

      switch (message.type) {
        case "auth":
          this.handleAuth(ws, connection, message.payload);
          break;
        case "subscribe":
          this.handleSubscribe(ws, connection, message.payload);
          break;
        case "unsubscribe":
          this.handleUnsubscribe(ws, connection, message.payload);
          break;
        case "ping":
          this.sendTo(ws, { type: "pong", payload: { serverTime: new Date().toISOString() } });
          break;
        case "message":
          this.handleChatMessage(ws, connection, message.payload);
          break;
        // WebRTC Signaling for voice/video calls
        case "call_offer":
        case "call_answer":
        case "ice_candidate":
        case "call_initiated":
        case "call_accepted":
        case "call_rejected":
        case "call_ended":
          this.handleCallSignaling(ws, connection, message.type, message.payload);
          break;
        case "user_typing":
          this.handleTypingIndicator(ws, connection, message.payload);
          break;
      }
    } catch (error) {
      console.error("WebSocket message parse error:", error);
    }
  }

  private handleAuth(ws: WebSocket, connection: UserConnection, payload: any) {
    const userId = payload?.userId;
    if (!userId) return;

    // Remove old socket mapping if exists
    const oldSocket = this.userToSocket.get(userId);
    if (oldSocket && oldSocket !== ws) {
      const oldConnection = this.connections.get(oldSocket);
      if (oldConnection) {
        oldConnection.userId = "";
      }
    }

    connection.userId = userId;
    this.userToSocket.set(userId, ws);
    
    this.sendTo(ws, { 
      type: "auth_success", 
      payload: { userId, connectedAt: new Date().toISOString() } 
    });
    
    console.log(`User ${userId} authenticated (Active users: ${this.userToSocket.size})`);
  }

  private handleSubscribe(ws: WebSocket, connection: UserConnection, payload: any) {
    const chatRoomId = String(payload?.chatRoomId);
    if (!chatRoomId) return;

    connection.subscribedRooms.add(chatRoomId);
    
    if (!this.roomSubscriptions.has(chatRoomId)) {
      this.roomSubscriptions.set(chatRoomId, new Set());
    }
    this.roomSubscriptions.get(chatRoomId)!.add(ws);

    this.sendTo(ws, { 
      type: "subscribed", 
      payload: { chatRoomId, subscribedAt: new Date().toISOString() } 
    });
  }

  private handleUnsubscribe(ws: WebSocket, connection: UserConnection, payload: any) {
    const chatRoomId = String(payload?.chatRoomId);
    if (!chatRoomId) return;

    connection.subscribedRooms.delete(chatRoomId);
    this.roomSubscriptions.get(chatRoomId)?.delete(ws);
  }

  private handleChatMessage(ws: WebSocket, connection: UserConnection, payload: any) {
    if (!payload?.chatRoomId) return;

    const chatRoomId = String(payload.chatRoomId);
    const messageData = {
      type: "message",
      payload: {
        ...payload,
        senderId: connection.userId || payload.senderId,
        timestamp: new Date().toISOString()
      }
    };

    // Broadcast to all subscribers except sender
    this.broadcastToRoom(chatRoomId, messageData, ws);
  }

  private handleCallSignaling(ws: WebSocket, connection: UserConnection, type: string, payload: any) {
    const targetUserId = payload?.targetUserId || payload?.calleeId;
    
    if (targetUserId) {
      // Send to specific user (direct call signaling)
      const targetWs = this.userToSocket.get(targetUserId);
      if (targetWs && targetWs.readyState === WebSocket.OPEN) {
        this.sendTo(targetWs, {
          type,
          payload: {
            ...payload,
            fromUserId: connection.userId,
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    // Also broadcast to room if chatRoomId is provided (for group calls)
    if (payload?.chatRoomId) {
      this.broadcastToRoom(payload.chatRoomId, {
        type,
        payload: {
          ...payload,
          fromUserId: connection.userId,
          timestamp: new Date().toISOString()
        }
      }, ws);
    }
  }

  private handleTypingIndicator(ws: WebSocket, connection: UserConnection, payload: any) {
    if (!payload?.chatRoomId) return;

    this.broadcastToRoom(payload.chatRoomId, {
      type: "user_typing",
      payload: {
        chatRoomId: payload.chatRoomId,
        userId: connection.userId,
        timestamp: new Date().toISOString()
      }
    }, ws);
  }

  private handleClose(ws: WebSocket) {
    const connection = this.connections.get(ws);
    if (connection) {
      // Clean up room subscriptions
      connection.subscribedRooms.forEach((roomId) => {
        this.roomSubscriptions.get(roomId)?.delete(ws);
      });

      // Remove user mapping
      if (connection.userId) {
        this.userToSocket.delete(connection.userId);
        // Broadcast user offline to their rooms
        connection.subscribedRooms.forEach((roomId) => {
          this.broadcastToRoom(roomId, {
            type: "user_offline",
            payload: { userId: connection.userId, timestamp: new Date().toISOString() }
          });
        });
      }

      this.connections.delete(ws);
    }
    console.log(`WebSocket client disconnected (Total: ${this.wss.clients.size})`);
  }

  private handleError(ws: WebSocket, error: Error) {
    console.error("WebSocket error:", error.message);
  }

  private handlePong(ws: WebSocket) {
    const connection = this.connections.get(ws);
    if (connection) {
      connection.isAlive = true;
      connection.lastPing = Date.now();
    }
  }

  // Heartbeat to detect dead connections
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const connection = this.connections.get(ws);
        if (!connection) return;

        if (!connection.isAlive) {
          // Connection didn't respond to ping - terminate
          ws.terminate();
          return;
        }

        connection.isAlive = false;
        ws.ping();
      });
    }, 30000); // Check every 30 seconds
  }

  // Cleanup stale data periodically
  private startCleanup() {
    this.cleanupInterval = setInterval(() => {
      // Clean up empty room subscriptions
      this.roomSubscriptions.forEach((sockets, roomId) => {
        if (sockets.size === 0) {
          this.roomSubscriptions.delete(roomId);
        }
      });
    }, 60000); // Every minute
  }

  // Send message to specific socket
  private sendTo(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ ...message, timestamp: message.timestamp || new Date().toISOString() }));
    }
  }

  // Broadcast to all subscribers in a room
  broadcastToRoom(chatRoomId: string, message: WebSocketMessage, excludeWs?: WebSocket) {
    const subscribers = this.roomSubscriptions.get(chatRoomId);
    if (!subscribers) return;

    const msgString = JSON.stringify({ ...message, timestamp: message.timestamp || new Date().toISOString() });
    
    subscribers.forEach((ws) => {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        ws.send(msgString);
      }
    });
  }

  // Send to specific user by userId
  sendToUser(userId: string, message: WebSocketMessage) {
    const ws = this.userToSocket.get(userId);
    if (ws) {
      this.sendTo(ws, message);
    }
  }

  // Broadcast to all connected clients
  broadcastToAll(message: WebSocketMessage, excludeWs?: WebSocket) {
    const msgString = JSON.stringify({ ...message, timestamp: new Date().toISOString() });
    
    this.wss.clients.forEach((ws) => {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        ws.send(msgString);
      }
    });
  }

  // Get stats for monitoring
  getStats() {
    return {
      totalConnections: this.wss.clients.size,
      authenticatedUsers: this.userToSocket.size,
      activeRooms: this.roomSubscriptions.size,
      roomDetails: Array.from(this.roomSubscriptions.entries()).map(([roomId, sockets]) => ({
        roomId,
        subscribers: sockets.size
      }))
    };
  }

  // Cleanup on shutdown
  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.wss.clients.forEach((ws) => {
      ws.close(1000, "Server shutting down");
    });
  }
}

// Export singleton instance
export const wsManager = new WebSocketManager();
