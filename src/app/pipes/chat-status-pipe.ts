import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatStatus',
  standalone: true,
})
export class ChatStatusPipe implements PipeTransform {
  transform(status: 'online' | 'offline', lastSeen: string): string {
    return status === 'online' ? 'En línea' : lastSeen;
  }
}