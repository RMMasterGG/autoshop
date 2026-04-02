import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {AuthApiService} from './auth-api.service';
import {AuthState, AuthResponse, User, UserRole, TokenResponse} from './auth.model';
import {LocalStorageService} from '../services/local-storage.service';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store,
               authApi = inject(AuthApiService),
               storage = inject(LocalStorageService),
               router = inject(Router)) => ({

    _applyTokensAndUser(response: AuthResponse | TokenResponse) {
      storage.setItem('accessToken', response.accessToken);
      storage.setItem('refreshToken', response.refreshToken);

      if ('username' in response) {
        const user = {
          username: response.username,
          email: response.email,
          role: response.role.replace("ROLE_", "") as UserRole,
          phone: response.phone ?? "",
          linkImg: response.linkImg ?? "",
        };
        storage.setItem('user', user);
        patchState(store, { user, isAuthenticated: true });
      }

      patchState(store, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    },

    async login(credentials: any) {
      patchState(store, {isLoading: true, error: null});
      try {
        const response = await firstValueFrom(authApi.login(credentials));
        this._applyTokensAndUser(response);

        router.navigate(['/']);
      } catch (e: any) {
        patchState(store, {
          isLoading: false,
          error: e.error?.message || 'Неверный логин или пароль'
        });
      }
    },

    async register(data: any) {
      patchState(store, {isLoading: true, error: null});
      try {
        const response = await firstValueFrom(authApi.register(data));
        this._applyTokensAndUser(response);

        router.navigate(['/']);
      } catch (e: any) {
        patchState(store, {
          isLoading: false,
          error: e.error?.message || 'Ошибка при регистрации'
        });
      }
    },

    async refreshTokens() {
      const currentRefreshToken = storage.getItem<string>('refreshToken');
      if (!currentRefreshToken) {
        this.logout();
        return null;
      }

      try {
        const response = await firstValueFrom(authApi.refresh(currentRefreshToken));

        this._applyTokensAndUser(response);

        console.log('Tokens refreshed successfully in background');
        return response.accessToken;
      } catch (e) {
        console.error('Refresh failed, logging out...');
        this.logout();
        return null;
      }
    },

    logout() {
      storage.removeItem('accessToken');
      storage.removeItem('refreshToken');
      patchState(store, initialState);
      router.navigate(['/auth/login']);
    },

    init() {
      const accessToken = storage.getItem<string>('accessToken');
      const refreshToken = storage.getItem<string>('refreshToken');
      const cachedUser = storage.getItem<User>('user');

      if (accessToken && cachedUser) {
        patchState(store, {
          user: cachedUser,
          accessToken: accessToken,
          refreshToken: refreshToken,
          isAuthenticated: true
        });

        this._verifySession();
      }
    },
    async _verifySession() {
      try {
        const freshUser = await firstValueFrom(authApi.me());
        const user = {
          ...freshUser,
          role: freshUser.role.replace("ROLE_", "") as UserRole
        };
        patchState(store, {user});
        storage.setItem('user', user);
        console.log('Session verified via server');
      } catch (e) {
        console.warn('Session verification failed, but keeping local data for now');
        // this.logout()
      }
    }
  })),
  withHooks({
    onInit(store) {
      store.init();
    }
  })
);
