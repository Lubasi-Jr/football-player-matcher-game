import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Game } from "@/types";
import { WS_DESTINATIONS } from "@/constants";

type MessageCallback = (game: Game) => void;
type ConnectionCallback = () => void;

class WebSocketService {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private messageCallback: MessageCallback | null = null;
  private onConnectCallback: ConnectionCallback | null = null;
  private onDisconnectCallback: ConnectionCallback | null = null;

  connect(
    gameId: string,
    onMessage: MessageCallback,
    onConnect?: ConnectionCallback,
    onDisconnect?: ConnectionCallback
  ): void {
    if (this.isConnected && this.client?.active) {
      console.log("WebSocket already connected");
      return;
    }

    this.messageCallback = onMessage;
    this.onConnectCallback = onConnect || null;
    this.onDisconnectCallback = onDisconnect || null;

    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/tekk";

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.log("STOMP:", str);
        }
      },
      onConnect: () => {
        console.log("WebSocket connected");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.subscribeToGame(gameId);
        this.onConnectCallback?.();
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        this.isConnected = false;
        this.onDisconnectCallback?.();
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        this.handleReconnect(gameId);
      },
    });

    this.client.activate();
  }

  private subscribeToGame(gameId: string): void {
    if (!this.client || !this.client.connected) {
      console.error("Cannot subscribe: client not connected");
      return;
    }

    // Unsubscribe from previous subscription if exists
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const destination = WS_DESTINATIONS.GAME_TOPIC(gameId);
    console.log("Subscribing to:", destination);

    this.subscription = this.client.subscribe(
      destination,
      (message: IMessage) => {
        try {
          const game: Game = JSON.parse(message.body);
          console.log("Received game update:", game);
          this.messageCallback?.(game);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      }
    );
  }

  private handleReconnect(gameId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
      setTimeout(() => {
        if (this.messageCallback) {
          this.connect(
            gameId,
            this.messageCallback,
            this.onConnectCallback || undefined,
            this.onDisconnectCallback || undefined
          );
        }
      }, 2000 * this.reconnectAttempts);
    }
  }

  send<T>(destination: string, payload: T): void {
    if (!this.client || !this.client.connected) {
      console.error("Cannot send: client not connected");
      return;
    }

    console.log("Sending to:", destination, payload);
    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }

  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.isConnected = false;
    this.messageCallback = null;
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
