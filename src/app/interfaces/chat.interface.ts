import { Message } from './message.interface';

export interface Chat {
  id: number;
  name: string;
  status: 'online' | 'offline';
  lastSeen: string;
  avatar: string;
  avatarUrl?: string;
  lastMessage?: string;
  messages: Message[];
}