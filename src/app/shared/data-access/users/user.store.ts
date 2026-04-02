import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  addEntity,
  updateEntity,
  removeEntity
} from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { AdminUserRequest, FullUserResponse, UserRole, UserState } from './user.model';
import {UserApiService} from './user-api.service';

const initialState: UserState = {
  isLoading: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withEntities<FullUserResponse>(),

  withMethods((store, userApi = inject(UserApiService)) => {

    // Внутренний хелпер для очистки роли от префикса ROLE_ (при получении с бэка)
    const mapUserIn = (user: FullUserResponse): FullUserResponse => ({
      ...user,
      role: user.role.replace('ROLE_', '') as UserRole
    });

    // Внутренний хелпер для добавления префикса ROLE_ (при отправке на бэк)
    const mapRequestOut = (req: AdminUserRequest): AdminUserRequest => ({
      ...req,
      role: `ROLE_${req.role}`
    });

    return {
      async loadAllUsers() {
        patchState(store, { isLoading: true, error: null });
        try {
          const rawUsers = await firstValueFrom(userApi.getAllUsers());
          const users = rawUsers.map(mapUserIn);
          patchState(store, setAllEntities(users), { isLoading: false });
        } catch (e) {
          patchState(store, { error: 'Ошибка загрузки пользователей', isLoading: false });
        }
      },

      async getUserInfo(id: string): Promise<FullUserResponse> {
        const user = await firstValueFrom(userApi.getUserById(id));
        return mapUserIn(user);
      },

      async createUser(rawRequest: AdminUserRequest) {
        patchState(store, { isLoading: true });
        try {
          const request = mapRequestOut(rawRequest);
          const newUser = await firstValueFrom(userApi.createUser(request));

          const mappedUser = mapUserIn(newUser);
          patchState(store, addEntity(mappedUser), { isLoading: false });
          return mappedUser;
        } catch (e) {
          patchState(store, { isLoading: false });
          throw e;
        }
      },

      async updateUser(id: string, rawRequest: AdminUserRequest) {
        patchState(store, { isLoading: true });
        try {
          const request = mapRequestOut(rawRequest);
          const updatedUser = await firstValueFrom(userApi.updateUser(id, request));

          const mappedUser = mapUserIn(updatedUser);
          patchState(store, updateEntity({ id, changes: mappedUser }), { isLoading: false });
          return mappedUser;
        } catch (e) {
          patchState(store, { isLoading: false });
          throw e;
        }
      },

      async deleteUser(id: string) {
        patchState(store, { isLoading: true });
        try {
          await firstValueFrom(userApi.deleteUser(id));
          patchState(store, removeEntity(id), { isLoading: false });
        } catch (e) {
          patchState(store, { error: 'Ошибка удаления', isLoading: false });
          throw e;
        }
      }
    };
  })
);
