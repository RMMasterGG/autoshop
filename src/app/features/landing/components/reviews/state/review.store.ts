import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {addEntities, setAllEntities, withEntities} from '@ngrx/signals/entities';
import {computed, inject} from '@angular/core';
import {LocalStorageService} from '../../../../../core/services/local-storage.service';
import { STORAGE_KEYS } from "../../../../../core/constants/storage-keys.const";
import {environment} from '../../../../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { Review } from "../types/review.type";

export interface reviewState {
  isLoading: boolean;
  error: string | null;
}

const initialState: reviewState = {
  isLoading: false,
  error: null
};

export const ReviewStore = signalStore(
  {providedIn: "root"},
  withState(initialState),
  withEntities<Review>(),
  withComputed((store) =>
    ({
    })),
  // Базовый
  withMethods((store) => ({
  })),
  // Загрузка
  withMethods((store,
               storage = inject(LocalStorageService),
               http = inject(HttpClient)) => ({
    loadFromStorage() {
      patchState(store, { isLoading: true });
      const cached = storage.getItem<Review[]>(STORAGE_KEYS.REVIEW_CACHE) ?? [];
      if (cached) {
        patchState(store, setAllEntities(cached), { isLoading: false });
      }
    },
    async loadFromApi(){
      patchState(store, { isLoading: true });

      try {
        const data = await firstValueFrom(http.get<Review[]>(`${environment.backendUrl}/api/reviews`));

        patchState(store, setAllEntities(data), { isLoading: false, error: null });
        storage.setItem(STORAGE_KEYS.REVIEW_CACHE, data);
      } catch (e) {
        patchState(store, { error: 'Failed to load services', isLoading: false });
      }
    }

  })),
  withHooks({
    onInit(store) {
      store.loadFromStorage();
      store.loadFromApi();
    }
  })
)
