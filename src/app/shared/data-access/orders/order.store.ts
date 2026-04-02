import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { OrderApiService } from './order-api.service';
import { PublicOrderRequest } from './order.model';

export const OrderStore = signalStore(
  { providedIn: "root" },
  withState({ isLoading: false, error: null as string | null }),
  withMethods((store, api = inject(OrderApiService)) => ({
    async placeOrder(request: PublicOrderRequest) {
      patchState(store, { isLoading: true, error: null });
      try {
        const response = await firstValueFrom(api.createPublicOrder(request));
        patchState(store, { isLoading: false });
        return response;
      } catch (e) {
        patchState(store, { isLoading: false, error: 'Ошибка при оформлении заказа' });
        throw e;
      }
    }
  }))
);
