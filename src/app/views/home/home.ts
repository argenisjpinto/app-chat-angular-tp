import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ChatList } from '../../components/chat-list/chat-list';
import { ChatWindow } from '../../components/chat-window/chat-window';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header, Footer, ChatList, ChatWindow],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);

  searchTerm = signal('');

  chats = computed(() => this.chatService.chats());

  filteredChats = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.chats();
    }

    return this.chats().filter((chat) =>
      chat.name.toLowerCase().includes(term)
    );
  });

  constructor() {
    effect(() => {
      const currentChats = this.chats();
      const routeId = this.route.snapshot.paramMap.get('id');
      const firstChatId = this.chatService.getFirstChatId();

      if (!routeId && firstChatId) {
        this.router.navigate(['/chats', firstChatId]);
      }

      if (routeId) {
        const exists = currentChats.some((chat) => chat.id === Number(routeId));

        if (!exists && firstChatId) {
          this.router.navigate(['/chats', firstChatId]);
        }
      }
    });
  }

  get selectedChatId(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? Number(id) : null;
  }

  get selectedChat() {
    if (!this.selectedChatId) return undefined;
    return this.chatService.getChatById(this.selectedChatId);
  }

  get chatNotFound(): boolean {
    return !!this.selectedChatId && !this.selectedChat;
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
  }

  onSendMessage(text: string): void {
    if (!this.selectedChatId) return;
    this.chatService.sendMessage(this.selectedChatId, text);
  }
}