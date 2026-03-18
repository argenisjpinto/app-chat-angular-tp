import { Component, EventEmitter, Input, Output, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '../../interfaces/chat.interface';
import { MessageForm } from '../message-form/message-form';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, MessageForm],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.css',
})
export class ChatWindow implements AfterViewChecked {
  private _chat: Chat | undefined;
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private shouldScrollToBottom = false;

  @Input()
  get chat(): Chat | undefined {
    return this._chat;
  }

  set chat(value: Chat | undefined) {
    const shouldScroll = !this._chat || 
      (value && value.messages.length > (this._chat?.messages?.length || 0));
    this._chat = value;
    if (value && shouldScroll) {
      this.shouldScrollToBottom = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}