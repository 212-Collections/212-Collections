import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setCollectionModal } from "./modal";
import { setMessage } from "./message";
import { setPage } from "./settings";
import { CollectionType } from "../../types/types";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
interface CollectionList {
  collections: CollectionType[];
}

const initialState: CollectionList = {
  collections: [],
};

export const fetchList = createAsyncThunk("list/fetch", async (thunkAPI) => {
  const response = await fetch("http://localhost:49449/collection/list", {
    method: "GET",
  });
  const data = response.json();
  return data;
});

export const saveCollection = createAsyncThunk(
  "collection/save",
  async (collection: { name: string }, thunkAPI) => {
    const response = await fetch("http://localhost:49449/collection/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...collection }),
    });
    const data = await response.json();
    if (data._id) {
      thunkAPI.dispatch(setCollectionModal({ open: false, loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title:
            i18n.t("message.item.new.success.title") +
            " " +
            i18n.t("message.item.type.collection"),
          description:
            data.name + " " + i18n.t("message.item.new.success.content"),
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(setCollectionModal({ loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title:
            i18n.t("message.item.new.error.title") +
            " " +
            i18n.t("message.item.type.collection"),
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const deleteCollection = createAsyncThunk(
  "collection/delete",
  async (collection: any, thunkAPI) => {
    const response = await fetch(
      "http://localhost:49449/collection/" + collection._id,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data._id) {
      thunkAPI.dispatch(setCollectionModal({ open: false, loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title:
            i18n.t("message.item.delete.success.title") +
            " " +
            i18n.t("message.item.type.collection"),
          description:
            data.name + " " + i18n.t("message.item.delete.success.content"),
          type: "success",
        })
      );
      thunkAPI.dispatch(setPage("home"));
      return data;
    } else {
      thunkAPI.dispatch(setCollectionModal({ loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title:
            i18n.t("message.item.delete.error.title") +
            " " +
            i18n.t("message.item.type.collection"),
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);
export const sortCollection = createAsyncThunk(
  "collection/sort",
  async (obj: any, thunkAPI) => {
    const response = await fetch("http://localhost:49449/collection/sort", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...obj }),
    });
    const data = await response.json();
    if (data.length > 0) {
      thunkAPI.dispatch(
        setMessage({
          title:
            i18n.t("message.item.sort.success.title") +
            " " +
            i18n.t("message.item.type.collection"),
          description: i18n.t("message.item.sort.success.content"),
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title:
            i18n.t("message.item.update.error.title") +
            " " +
            i18n.t("message.item.type.collection"),
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const CollectionListSlice = createSlice({
  name: "collectionList",
  initialState,
  reducers: {
    updateCollectionList: (state, action) => {
      state.collections = state.collections.map((collection) => {
        if (collection._id === action.payload._id) {
          return action.payload;
        } else {
          return collection;
        }
      });
    },
    setCollectionList: (state, action) => {
      console.log([...action.payload]);
      state.collections = [...action.payload];
    },
    resetListReducer: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchList.fulfilled, (state, action) => {
      state.collections = action.payload;
    });
    builder.addCase(saveCollection.fulfilled, (state, action) => {
      if (action.payload) state.collections.push(action.payload);
    });
    builder.addCase(deleteCollection.fulfilled, (state, action) => {
      if (action.payload)
        state.collections = state.collections.filter(
          (c) => c._id !== action.payload._id
        );
    });
    builder.addCase(sortCollection.fulfilled, (state, action) => {
      // if (action.payload)
      //   state.collections = action.payload;
    });
  },
});

export default CollectionListSlice.reducer;
export const { updateCollectionList, setCollectionList, resetListReducer } =
  CollectionListSlice.actions;
