import { configureStore } from "@reduxjs/toolkit";
import billingReducer from "./billingSlice";
import authReducer from "./authSlice";
import emailMaskReducer from "./emailMaskSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      billing: billingReducer,
      auth: authReducer,
      emailMask: emailMaskReducer,
    },
  });
};

// Singleton store for client-side rendering
let clientStore: ReturnType<typeof makeStore> | undefined;

export const getStore = () => {
  // For SSR, always create a new store
  if (typeof window === "undefined") return makeStore();

  // Create store if unavailable on the client
  if (!clientStore) clientStore = makeStore();

  return clientStore;
};

export const store = getStore();

// Infer the type of makeStore
type Store = ReturnType<typeof makeStore>;

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
