import { Routes } from '@angular/router';
import { Login } from './views/login/login';
import { Home } from './views/home/home';
import { NewChat } from './views/new-chat/new-chat';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'chats',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'chats/:id',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'nuevo',
    component: NewChat,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];