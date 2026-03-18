import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Chat } from '../../interfaces/chat.interface';
import { ChatStatusPipe } from '../../pipes/chat-status-pipe';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ChatStatusPipe],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css',
})
export class ChatList {
  @Input() chats: Chat[] = [];
  @Input() selectedChatId: number | null = null;
  @Input() searchTerm = '';

  @Output() searchTermChange = new EventEmitter<string>();

  onSearchChange(value: string): void {
    this.searchTermChange.emit(value);
  }
}