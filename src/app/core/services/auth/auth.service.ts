import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import LoginResponse from './models/LoginResponse';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private tokenKey = 'authtoken';
  private userSubject = new BehaviorSubject<any>(this.getUserFromToken());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserFromToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Invalid token:', error);
        return null;
      }
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
