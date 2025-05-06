import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  username: string;
  email: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor(private router: Router) {}

  async register(username: string, email: string, password: string) {
    try {
      if (this.users.some(user => user.email === email)) {
        throw new Error('User with this email already exists');
      }

      const newUser: User = {
        username,
        email,
        createdAt: new Date().toISOString()
      };

      this.users.push(newUser);
      this.currentUser = newUser;

      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }

      const user = this.users.find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }

      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return user;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
 
}
