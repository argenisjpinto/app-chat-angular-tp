import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { NewChatForm } from '../../components/new-chat-form/new-chat-form';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [Header, Footer, NewChatForm],
  templateUrl: './new-chat.html',
  styleUrl: './new-chat.css',
})
export class NewChat {
  private chatService = inject(ChatService);
  private router = inject(Router);

  duplicateError = false;

  onCreateChat(name: string): void {
    this.duplicateError = false;

    const newChat = this.chatService.createChat(name);

    if (!newChat) {
      this.duplicateError = true;
      return;
    }

    this.router.navigate(['/chats', newChat.id]);
  }

  goBack(): void {
    const firstChatId = this.chatService.getFirstChatId();

    if (firstChatId) {
      this.router.navigate(['/chats', firstChatId]);
      return;
    }

    this.router.navigate(['/chats']);
  }
}