import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api';
  private readonly MULTI_AGENT = `${this.API_URL}/chat`;
  private readonly USERS_URL = `${this.API_URL}/users`;

  constructor(private httpClient: HttpClient) {}

  register(user: User): Observable<any> {
    return this.httpClient.post(`${this.USERS_URL}/register`, user);
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.get(`${this.USERS_URL}/login/${username}/${password}`);
  }

  getChat(payload: any): Observable<any> {
    const url = `${this.MULTI_AGENT}/load-chat`;
    return this.httpClient.post(url, payload);
  }
}
