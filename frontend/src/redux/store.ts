import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ModalSlice } from "./reducers/modal";
import { SettingsSlice } from "./reducers/settings";
import { CollectionListSlice } from "./reducers/list";
import { MessageSlice } from "./reducers/message";
import { CollectionSlice } from "./reducers/collection";

export const store = configureStore({
  reducer: {
    modal: ModalSlice.reducer,
    settings: SettingsSlice.reducer,
    list: CollectionListSlice.reducer,
    message: MessageSlice.reducer,
    collection: CollectionSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
