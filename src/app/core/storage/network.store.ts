import {signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';

export interface NetworkState {
  isOnline: boolean;
}

const initialState: NetworkState = {
  isOnline: true,
};

export const NetworkStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed((store) => ({

  })),
  withMethods((store) => ({

  })),
  withMethods((store) => ({

  })),
  withHooks({
    onInit(store) {
      console.log(store.isOnline());
    }
  })
)

