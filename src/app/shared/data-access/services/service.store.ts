import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState, withHooks } from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  addEntity,
  updateEntity,
  removeEntity
} from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { STORAGE_KEYS } from "../../../core/constants/storage-keys.const";
import { ServiceAdmin, ServiceEntity, ServiceState } from "./service.model";
import { ServiceApiService } from './service-api.service';

const initialState: ServiceState = {
  isLoading: false,
  error: null,
};

export const ServiceStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withEntities<ServiceEntity>(),

  withMethods((store,
               api = inject(ServiceApiService),
               storage = inject(LocalStorageService)) => ({

    loadFromStorage() {
      const cached = storage.getItem<ServiceEntity[]>(STORAGE_KEYS.SERVICE_CACHE);
      if (cached?.length) {
        patchState(store, setAllEntities(cached));
      }
    },

    /**
     * Загрузка для Лендинга (публичная)
     */
    async loadAllServices() {
      patchState(store, { isLoading: true });
      try {
        const data = await firstValueFrom(api.getPublicServices());
        patchState(store, setAllEntities(data as ServiceEntity[]), { isLoading: false, error: null });
        storage.setItem(STORAGE_KEYS.SERVICE_CACHE, data);
      } catch (e) {
        patchState(store, { error: 'Failed to load services', isLoading: false });
      }
    },

    /**
     * Загрузка для Админки (расширенная)
     */
    async loadAdminServices() {
      patchState(store, { isLoading: true });
      try {
        const data = await firstValueFrom(api.getAdminServices());
        patchState(store, setAllEntities(data as ServiceEntity[]), { isLoading: false });
      } catch (e) {
        patchState(store, { error: 'Ошибка загрузки админ-панели', isLoading: false });
      }
    },

    async getFullServiceById(id: string): Promise<ServiceAdmin> {
      return firstValueFrom(api.getServiceById(id));
    },

    async createService(request: ServiceAdmin) {
      patchState(store, { isLoading: true });
      try {
        const result = await firstValueFrom(api.createService(request));
        patchState(store, addEntity(result as ServiceEntity), { isLoading: false });
        return result;
      } catch (e) {
        patchState(store, { isLoading: false });
        throw e;
      }
    },

    async updateService(id: string, request: ServiceAdmin) {
      patchState(store, { isLoading: true });
      try {
        const result = await firstValueFrom(api.updateService(id, request));
        patchState(store, updateEntity({ id, changes: result as ServiceEntity }), { isLoading: false });
        return result;
      } catch (e) {
        patchState(store, { isLoading: false });
        throw e;
      }
    },

    async deleteService(id: string) {
      patchState(store, { isLoading: true });
      try {
        await firstValueFrom(api.deleteService(id));
        patchState(store, removeEntity(id), { isLoading: false });
      } catch (e) {
        patchState(store, { isLoading: false });
      }
    }
  })),

  withHooks({
    onInit(store) {
      store.loadFromStorage();
    }
  })
);
