import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./activeUser/activeUserSlice";
import { chatReducer } from "./chat/chatSlice";

const rootPersistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user"],
};

const reducers = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

const persistedReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
