import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormComponent } from '../../components/form/form';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/chats']);
    }
  }

  handleLogin(userData: { name: string; email: string }): void {
    this.authService.login({
      name: userData.name,
      email: userData.email,
      isLoggedIn: true,
    });

    this.router.navigate(['/chats']);
  }
}