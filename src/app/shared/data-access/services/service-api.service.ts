import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Service, ServiceAdmin } from './service.model';

@Injectable({ providedIn: 'root' })
export class ServiceApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.backendUrl}/api/services`;

  getPublicServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.baseUrl);
  }

  getAdminServices(): Observable<ServiceAdmin[]> {
    return this.http.get<ServiceAdmin[]>(`${this.baseUrl}/admin`);
  }

  getServiceById(id: string): Observable<ServiceAdmin> {
    return this.http.get<ServiceAdmin>(`${this.baseUrl}/${id}`);
  }

  createService(data: ServiceAdmin): Observable<ServiceAdmin> {
    return this.http.post<ServiceAdmin>(`${this.baseUrl}/create`, data);
  }

  updateService(id: string, data: ServiceAdmin): Observable<ServiceAdmin> {
    return this.http.put<ServiceAdmin>(`${this.baseUrl}/update/${id}`, data);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
