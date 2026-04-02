import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState, withHooks } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { AdminShop, ShopEntity, ShopState, SortOption } from './shop.model';
import { ShopApiService } from './shop-api.service';

const initialState: ShopState = {
  isLoading: false,
  totalElements: 0,
  hasNext: false,
  categories: [],
  currentCategories: [],
  maxPrice: null,
  sort: "news",
  error: null
};

export const ShopStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withEntities<ShopEntity>(),

  withMethods((store, shopApi = inject(ShopApiService)) => ({

    async loadCategories() {
      const categories = await firstValueFrom(shopApi.getCategories());
      patchState(store, { categories });
    },

    /**
     * Загрузка для пользователей (Витрина)
     */
    async loadCards() {
      patchState(store, { isLoading: true });
      try {
        const res = await firstValueFrom(
          shopApi.getCards(store.sort(), store.currentCategories(), store.maxPrice())
        );
        patchState(store, setAllEntities(res.cards as ShopEntity[]), {
          totalElements: res.totalElements,
          hasNext: res.hasNext,
          isLoading: false
        });
      } catch (e) {
        patchState(store, { isLoading: false, error: 'Failed to load shop' });
      }
    },

    /**
     * Загрузка для админа
     */
    async loadAdminCards() {
      patchState(store, { isLoading: true });
      try {
        const res = await firstValueFrom(shopApi.getAdminCards());
        patchState(store, setAllEntities(res.cards as ShopEntity[]), {
          totalElements: res.totalElements,
          isLoading: false
        });
      } catch (e) {
        patchState(store, { isLoading: false });
      }
    },

    async getFullProductById(id: string): Promise<AdminShop> {
      return firstValueFrom(shopApi.getCardById(id));
    },

    async createCard(request: AdminShop) {
      patchState(store, { isLoading: true });
      try {
        const result = await firstValueFrom(shopApi.createCard(request));
        // Добавляем результат (он типа AdminShop, который входит в ShopEntity)
        patchState(store, addEntity(result as ShopEntity), { isLoading: false });
        return result;
      } catch (e) {
        patchState(store, { isLoading: false });
        throw e;
      }
    },

    async updateCard(id: string, request: AdminShop) {
      patchState(store, { isLoading: true });
      try {
        const result = await firstValueFrom(shopApi.updateCard(id, request));
        patchState(store, updateEntity({ id, changes: result as ShopEntity }), { isLoading: false });
        return result;
      } catch (e) {
        patchState(store, { isLoading: false });
        throw e;
      }
    },

    async deleteCard(id: string) {
      patchState(store, { isLoading: true });
      try {
        await firstValueFrom(shopApi.deleteCard(id));
        patchState(store, removeEntity(id), { isLoading: false });
      } catch (e) {
        patchState(store, { isLoading: false });
      }
    },

    setFilters(categories: string[]) {
      patchState(store, { currentCategories: categories });
      this.loadCards();
    },

    setSort(newSort: SortOption) {
      patchState(store, { sort: newSort });
      this.loadCards();
    },

    setPriceFilter(price: number) {
      patchState(store, { maxPrice: price });
      this.loadCards();
    }
  })),

  withHooks({
    onInit(store) {
      store.loadCategories();
    }
  })
);
