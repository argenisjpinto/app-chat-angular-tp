import { Injectable, signal } from '@angular/core';
import { UserSession } from '../interfaces/user-session.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'userSession';

  currentUser = signal<UserSession | null>(this.getSessionFromStorage());

  login(user: UserSession): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    const session = this.getSessionFromStorage();
    return !!session?.isLoggedIn;
  }

  getUser(): UserSession | null {
    return this.currentUser();
  }

  private getSessionFromStorage(): UserSession | null {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) return null;

    try {
      return JSON.parse(data) as UserSession;
    } catch (error) {
      console.error('Error al leer la sesión del localStorage', error);
      return null;
    }
  }
}