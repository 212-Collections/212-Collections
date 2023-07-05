import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCollectionModal, setItemModal } from "./modal";
import { setMessage } from "./message";
import { CollectionType, ItemType } from "../../types/types";
import { updateCollectionList } from "./list";

const initialState: { collection: CollectionType } = {
  collection: { _id: "", name: "", view: "antd-card", items: [] },
};

export const fetchCollection = createAsyncThunk(
  "collection/fetch",
  async (id: string, thunkAPI) => {
    const responseCollection = await fetch(
      "http://localhost:49449/collection/" + id,
      {
        method: "GET",
      }
    );
    const collection = await responseCollection.json();
    const responseItems = await fetch("http://localhost:49449/item/" + id, {
      method: "GET",
    });
    const items = await responseItems.json();
    if (collection._id) {
      collection.items = items || [];
      return collection;
    } else {
      return null;
    }
  }
);

export const saveItem = createAsyncThunk(
  "item/save",
  async (item: { title: string; collection_id: string }, thunkAPI) => {
    const response = await fetch("http://localhost:49449/item/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...item }),
    });
    const data = await response.json();
    if (data._id) {
      thunkAPI.dispatch(setItemModal({ open: false, loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title: "New item",
          description: "The new item " + data.title + " has been created",
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(setItemModal({ loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title: "Error while creating new item",
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const updateItem = createAsyncThunk(
  "item/update",
  async (item: any, thunkAPI) => {
    const response = await fetch("http://localhost:49449/item/" + item._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...item }),
    });
    const data = await response.json();
    if (data._id) {
      thunkAPI.dispatch(setItemModal({ open: false, loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title: "Update item",
          description: "The item " + data.title + " has been updated",
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(setItemModal({ loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title: "Error while updating item",
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const deleteItem = createAsyncThunk(
  "item/delete",
  async (item: any, thunkAPI) => {
    const response = await fetch("http://localhost:49449/item/" + item._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collectionId: item.collectionId }),
    });
    const data = await response.json();
    if (data._id) {
      thunkAPI.dispatch(setItemModal({ open: false, loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title: "Delete item",
          description: "The item " + data.title + " has been deleted",
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(setItemModal({ loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title: "Error while deleting item",
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const updateCollection = createAsyncThunk(
  "collection/update",
  async (collection: any, thunkAPI) => {
    const response = await fetch(
      "http://localhost:49449/collection/" + collection._id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...collection }),
      }
    );
    const data = await response.json();
    if (data._id) {
      thunkAPI.dispatch(setCollectionModal({ open: false, loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title: "Update",
          description: "The collection has been updated",
          type: "success",
        })
      );
      thunkAPI.dispatch(updateCollectionList(data));
      return data;
    } else {
      thunkAPI.dispatch(setCollectionModal({ loading: false }));
      thunkAPI.dispatch(
        setMessage({
          title: "Error while updating collection",
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const CollectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    resetCollectionReducer: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCollection.fulfilled,
      (state, action: PayloadAction<Partial<CollectionType>>) => {
        if (action.payload)
          state.collection = {
            ...state.collection,
            ...action.payload,
            icon: action.payload.icon || undefined,
          };
      }
    );
    builder.addCase(
      saveItem.fulfilled,
      (state, action: PayloadAction<ItemType>) => {
        if (action.payload)
          state.collection = {
            ...state.collection,
            items: state.collection.items.concat(action.payload),
          };
      }
    );
    builder.addCase(
      updateCollection.fulfilled,
      (state, action: PayloadAction<CollectionType>) => {
        if (action.payload) {
          state.collection = {
            ...state.collection,
            ...action.payload,
          };
        }
      }
    );
    builder.addCase(
      updateItem.fulfilled,
      (state, action: PayloadAction<ItemType>) => {
        if (action.payload) {
          state.collection = {
            ...state.collection,
            items: state.collection.items.map((item) =>
              item._id === action.payload._id ? action.payload : item
            ),
          };
        }
      }
    );

    builder.addCase(
      deleteItem.fulfilled,
      (state, action: PayloadAction<ItemType>) => {
        if (action.payload) {
          state.collection = {
            ...state.collection,
            items: state.collection.items.filter(
              (item) => item._id !== action.payload._id
            ),
          };
        }
      }
    );
  },
});

export default CollectionSlice.reducer;
export const { resetCollectionReducer } = CollectionSlice.actions;
