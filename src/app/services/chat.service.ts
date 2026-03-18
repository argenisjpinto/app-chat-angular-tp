import { Injectable, signal } from '@angular/core';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly STORAGE_KEY = 'chatAppChats';

  private initialChats: Chat[] = [
    {
      id: 1,
      name: 'María',
      status: 'online',
      lastSeen: 'En línea',
      avatar: 'M',
      avatarUrl: this.generateAvatarUrl('María'),
      lastMessage: 'Todo bien, ¿y tú?',
      messages: [
        {
          id: 1,
          text: 'Hola, ¿cómo estás?',
          sender: 'contact',
          timestamp: '10:30',
        },
        {
          id: 2,
          text: 'Todo bien, ¿y tú?',
          sender: 'me',
          timestamp: '10:31',
        },
      ],
    },
    {
      id: 2,
      name: 'Carlos',
      status: 'offline',
      lastSeen: 'Hace 10 min',
      avatar: 'C',
      avatarUrl: this.generateAvatarUrl('Carlos'),
      lastMessage: 'Sí, la estoy revisando ahora.',
      messages: [
        {
          id: 1,
          text: '¿Ya viste la consigna final?',
          sender: 'contact',
          timestamp: '09:10',
        },
        {
          id: 2,
          text: 'Sí, la estoy revisando ahora.',
          sender: 'me',
          timestamp: '09:12',
        },
      ],
    },
    {
      id: 3,
      name: 'Luis',
      status: 'offline',
      lastSeen: 'Hace 1 hora',
      avatar: 'L',
      avatarUrl: this.generateAvatarUrl('Luis'),
      lastMessage: 'Te escribo más tarde.',
      messages: [
        {
          id: 1,
          text: 'Te escribo más tarde.',
          sender: 'contact',
          timestamp: '08:15',
        },
      ],
    },
  ];

  chats = signal<Chat[]>(this.loadChats());

  getChats(): Chat[] {
    return this.chats();
  }

  getFirstChatId(): number | null {
    const chats = this.chats();
    return chats.length > 0 ? chats[0].id : null;
  }

  getChatById(id: number): Chat | undefined {
    return this.chats().find((chat) => chat.id === id);
  }

  chatExists(name: string): boolean {
    const normalizedName = name.trim().toLowerCase();

    return this.chats().some(
      (chat) => chat.name.trim().toLowerCase() === normalizedName
    );
  }

  createChat(name: string): Chat | null {
    const trimmedName = name.trim();

    if (!trimmedName || this.chatExists(trimmedName)) {
      return null;
    }

    const newChat: Chat = {
      id: this.getNextChatId(),
      name: trimmedName,
      status: 'offline',
      lastSeen: 'Sin conexión reciente',
      avatar: trimmedName.charAt(0).toUpperCase(),
      avatarUrl: this.generateAvatarUrl(trimmedName),
      lastMessage: '',
      messages: [],
    };

    const updatedChats = [...this.chats(), newChat];
    this.chats.set(updatedChats);
    this.saveChats();

    return newChat;
  }

  sendMessage(chatId: number, text: string): void {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const updatedChats = this.chats().map((chat) => {
      if (chat.id !== chatId) return chat;

      const newMessage: Message = {
        id: this.getNextMessageId(chat.messages),
        text: trimmedText,
        sender: 'me',
        timestamp: this.getCurrentTime(),
      };

      return {
        ...chat,
        lastMessage: trimmedText,
        messages: [...chat.messages, newMessage],
      };
    });

    this.chats.set(updatedChats);
    this.saveChats();
    this.autoReply(chatId);
  }

  private autoReply(chatId: number): void {
    const replies = [
      'Perfecto!',
      'Dale, ahora lo reviso.',
      'Entendido.',
      'Gracias por avisar.',
      'Buenísimo, seguimos en contacto.',
      'Mañana lo vemos con más calma.',
      'Genial, gracias!',
      'Lo tengo en cuenta.',
      '¡Excelente, gracias por la info!',
      'Me dijoron que lo revisan hoy.',
      'Hay que entregarlo el lunes, así que no hay apuro.',
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
      const updatedChats = this.chats().map((chat) => {
        if (chat.id !== chatId) return chat;

        const replyMessage: Message = {
          id: this.getNextMessageId(chat.messages),
          text: randomReply,
          sender: 'contact',
          timestamp: this.getCurrentTime(),
        };

        return {
          ...chat,
          lastMessage: randomReply,
          messages: [...chat.messages, replyMessage],
        };
      });

      this.chats.set(updatedChats);
      this.saveChats();
    }, 1200);
  }

  private getNextChatId(): number {
    const chats = this.chats();
    if (chats.length === 0) return 1;
    return Math.max(...chats.map((chat) => chat.id)) + 1;
  }

  private getNextMessageId(messages: Message[]): number {
    if (messages.length === 0) return 1;
    return Math.max(...messages.map((message) => message.id)) + 1;
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private generateAvatarUrl(name: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      name
    )}`;
  }

  private normalizeChats(chats: Chat[]): Chat[] {
    return chats.map((chat) => ({
      ...chat,
      avatar: chat.avatar || chat.name.charAt(0).toUpperCase(),
      avatarUrl: chat.avatarUrl || this.generateAvatarUrl(chat.name),
    }));
  }

  private loadChats(): Chat[] {
    const storedChats = localStorage.getItem(this.STORAGE_KEY);

    if (!storedChats) {
      const normalizedInitialChats = this.normalizeChats(this.initialChats);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(normalizedInitialChats));
      return normalizedInitialChats;
    }

    try {
      const parsedChats = JSON.parse(storedChats) as Chat[];
      const normalizedChats = this.normalizeChats(parsedChats);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(normalizedChats));
      return normalizedChats;
    } catch (error) {
      console.error('Error al leer chats del localStorage', error);
      const normalizedInitialChats = this.normalizeChats(this.initialChats);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(normalizedInitialChats));
      return normalizedInitialChats;
    }
  }

  private saveChats(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.chats()));
  }
}