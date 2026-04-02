import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminUserRequest, FullUserResponse } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.backendUrl}/api/users`;

  getAllUsers(): Observable<FullUserResponse[]> {
    return this.http.get<FullUserResponse[]>(`${this.baseUrl}/admin`);
  }

  getUserById(id: string): Observable<FullUserResponse> {
    return this.http.get<FullUserResponse>(`${this.baseUrl}/admin/info/${id}`);
  }

  createUser(request: AdminUserRequest): Observable<FullUserResponse> {
    return this.http.post<FullUserResponse>(`${this.baseUrl}/create`, request);
  }

  updateUser(id: string, request: AdminUserRequest): Observable<FullUserResponse> {
    return this.http.put<FullUserResponse>(`${this.baseUrl}/update/${id}`, request);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
