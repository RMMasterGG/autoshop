import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

export interface TrafficData {
  date: string;
  count: number;
}

export interface DashboardStats {
  visits: number;
  orders: number;
  revenue: number;
  avgRaring: number;
}

export interface DashboardState {
  traffic: TrafficData[];
  stats: DashboardStats | null;
  recentOrders: any[];
  days: number; // Текущий выбранный период
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  traffic: [],
  stats: null,
  recentOrders: [],
  days: 7, // По умолчанию за последние 7 дней
  isLoading: false,
  error: null
};

export const DashboardStore = signalStore(
  { providedIn: "root" },
  withState(initialState),

  withMethods((store, http = inject(HttpClient)) => ({

    /**
     * Основной метод загрузки данных
     * @param days - количество дней для анализа
     */
    async loadAllDashboardData(days: number = store.days()) {
      patchState(store, { isLoading: true, error: null, days });

      // Формируем query-параметры ?days=...
      const params = new HttpParams().set('days', days.toString());

      try {
        const [traffic, stats, orders] = await Promise.all([
          firstValueFrom(http.get<TrafficData[]>(`${environment.backendUrl}/api/admin/traffic-analysis`, { params })),
          firstValueFrom(http.get<DashboardStats>(`${environment.backendUrl}/api/admin/stats`, { params })),
          // Заказы тоже принимают days согласно твоему ТЗ
          firstValueFrom(http.get<any[]>(`${environment.backendUrl}/api/admin/orders`, { params })).catch(() => [])
        ]);

        patchState(store, {
          traffic,
          stats,
          recentOrders: orders,
          isLoading: false
        });
      } catch (e) {
        console.error('Dashboard loading error:', e);
        patchState(store, {
          error: 'Ошибка при загрузке аналитики',
          isLoading: false
        });
      }
    },

    /**
     * Метод для переключения периода (например, кнопками 7д, 30д, 90д)
     */
    updatePeriod(days: number) {
      this.loadAllDashboardData(days);
    }
  }))
);
