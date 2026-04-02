import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminShop, Category, ShopListResponse, SortOption } from './shop.model';

@Injectable({ providedIn: 'root' })
export class ShopApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.backendUrl}/api/shop`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getCards(sort: SortOption, categories: string[], maxPrice: number | null): Observable<ShopListResponse> {
    let params = new HttpParams().set('sortBy', sort);
    if (categories.length) params = params.set('categories', categories.join(','));
    if (maxPrice !== null) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<ShopListResponse>(`${this.baseUrl}/cards`, { params });
  }

  getAdminCards(): Observable<ShopListResponse> {
    return this.http.get<ShopListResponse>(`${this.baseUrl}/cards/admin`);
  }

  getCardById(id: string): Observable<AdminShop> {
    return this.http.get<AdminShop>(`${this.baseUrl}/card/${id}`);
  }

  createCard(data: AdminShop): Observable<AdminShop> {
    return this.http.post<AdminShop>(`${this.baseUrl}/card`, data);
  }

  updateCard(id: string, data: AdminShop): Observable<AdminShop> {
    return this.http.put<AdminShop>(`${this.baseUrl}/card/${id}`, data);
  }

  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/card/${id}`);
  }
}
