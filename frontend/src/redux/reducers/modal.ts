import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AvatarType, ImageType, UploadType } from "../../types/types";

export interface Modal {
  open: boolean;
  loading: boolean;
}
export interface RootModal {
  open: boolean;
  loading: boolean;
  type: "new" | "update";
  data?: any;
}
export interface ImageModal {
  open: boolean;
  loading: boolean;
  type: "avatar" | "image";
  options: UploadType[];
  imageInit?: AvatarType | ImageType | null;
  name: string;
}

interface ModalState {
  collectionModal: RootModal;
  itemModal: RootModal;
  imageModal: ImageModal;
}

const initialState: ModalState = {
  collectionModal: {
    open: false,
    loading: false,
    type: "new",
  },
  itemModal: {
    open: false,
    loading: false,
    type: "new",
  },
  imageModal: {
    open: false,
    loading: false,
    type: "image",
    options: [],
    name: "",
  },
};

export const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setCollectionModal: (state, action: PayloadAction<Partial<RootModal>>) => {
      state.collectionModal = {
        ...state.collectionModal,
        ...action.payload,
        data: action.payload.data || null,
      };
    },
    setItemModal: (state, action: PayloadAction<Partial<RootModal>>) => {
      state.itemModal = {
        ...state.itemModal,
        ...action.payload,
        data: action.payload.data || null,
      };
    },
    setImageModal: (state, action: PayloadAction<Partial<ImageModal>>) => {
      state.imageModal = {
        ...state.imageModal,
        ...action.payload,
        imageInit: action.payload.imageInit || null,
      };
    },
    resetModalReducer: (state) => {
      state = initialState;
    },
  },
});

export default ModalSlice.reducer;
export const {
  setCollectionModal,
  setItemModal,
  setImageModal,
  resetModalReducer,
} = ModalSlice.actions;
