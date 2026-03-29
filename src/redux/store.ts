import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { userReducer } from "./activeUser/activeUserSlice";
import { adminUserReducer } from "./adminUser/adminUserSlice";
import { chatReducer } from "./chat/chatSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["currentUser"],
};

const reducers = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  chat: chatReducer,
  adminUser: adminUserReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
