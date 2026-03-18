export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'contact';
  timestamp: string;
}