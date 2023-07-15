import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetMessageReducer, setMessage } from "./message";
import { resetModalReducer } from "./modal";
import { resetListReducer } from "./list";
import { resetCollectionReducer } from "./collection";

export type ThemeState = "light" | "dark";
export type PageState = string;

interface AsideType {
  theme: ThemeState;
  page: PageState;
  defaultItemView: string;
  username?: string | undefined;
  settings: {
    theme: ThemeState;
    view: string;
  };
  selectedText?: string
}

const initialState: AsideType = {
  theme: "dark",
  defaultItemView: "card",
  page: "home",
  settings: {
    theme: "dark",
    view: "card",
  },
};

export const login = createAsyncThunk(
  "login/username",
  async (
    user: { username: string; password: string; cluster: string },
    thunkAPI
  ) => {
    const response = await fetch("http://localhost:49449/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user }),
    });
    const data = await response.json();
    if (data.username) {
      localStorage.setItem("username", data.username);
      localStorage.setItem("cluster", data.cluster);
      localStorage.setItem("token", data.token);
      thunkAPI.dispatch(
        setMessage({
          title: "Successfully authenticated",
          description: "You are now logged as " + data.username,
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title: "Error authenticating",
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const loginToken = createAsyncThunk(
  "login/token",
  async (token: string, thunkAPI) => {
    const response = await fetch("http://localhost:49449/token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.username) {
      thunkAPI.dispatch(
        setMessage({
          title: "Successfully authenticated",
          description: "You are now logged as " + data.username,
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title: "Error authenticating",
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
  const response = await fetch("http://localhost:49449/logout", {
    method: "POST",
  });
  const data = await response.json();
  if (data.logout) {
    thunkAPI.dispatch(
      setMessage({
        title: "Successfully logged out",
        description: "You have successfully logged out",
        type: "success",
      })
    );
    thunkAPI.dispatch(resetModalReducer());
    thunkAPI.dispatch(resetMessageReducer());
    thunkAPI.dispatch(resetListReducer());
    thunkAPI.dispatch(resetCollectionReducer());
    thunkAPI.dispatch(resetAsideReducer());
    return data;
  } else {
    thunkAPI.dispatch(
      setMessage({
        title: "Error logging out",
        description: data.message,
        type: "error",
      })
    );
    return null;
  }
});

export const fetchSettings = createAsyncThunk(
  "settings/fetch",
  async (_, thunkAPI) => {
    const response = await fetch("http://localhost:49449/settings", {
      method: "GET",
    });
    const data = await response.json();
    if (data.theme) {
      thunkAPI.dispatch(setTheme(data.theme));
      if (data.itemView) thunkAPI.dispatch(setDefaultItemView(data.itemView));
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title: "Error fetching settings",
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const saveSettings = createAsyncThunk(
  "settings/update",
  async (settings: any, thunkAPI) => {
    const response = await fetch("http://localhost:49449/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...settings }),
    });
    const data = await response.json();
    if (data.theme) {
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title: "Error updating settings",
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const AsideSlice = createSlice({
  name: "aside",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeState>) => {
      state.theme = action.payload;
    },
    setDefaultItemView: (state, action: PayloadAction<string>) => {
      state.defaultItemView = action.payload;
    },
    setPage: (state, action: PayloadAction<string>) => {
      state.page = action.payload;
    },
    setUsername: (state, action: PayloadAction<string | undefined>) => {
      state.username = action.payload;
    },
    resetAsideReducer: (state) => {
      state = initialState;
    },
    setSelectedText: (state, action) => {
      state.selectedText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload) {
        state.username = action.payload.username;
        state.page = "home";
      }
    });
    builder.addCase(
      loginToken.fulfilled,
      (state, action: PayloadAction<any>) => {
        if (action.payload) {
          state.username = action.payload.username;
          state.page = "home";
        }
      }
    );
    builder.addCase(logout.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload) {
        state.username = undefined;
        localStorage.removeItem("token");
      }
    });
    builder.addCase(
      fetchSettings.fulfilled,
      (state, action: PayloadAction<any>) => {
        if (action.payload) {
          state.settings = action.payload;
        }
      }
    );
    builder.addCase(
      saveSettings.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload;
        if (data) {
          state.settings = {
            ...state.settings,
            theme: data.theme,
            view: data.itemview,
          };
          state.theme = data.theme;
          state.defaultItemView = data.itemview;
        }
      }
    );
  },
});

export default AsideSlice.reducer;
export const { setTheme, setPage, resetAsideReducer, setDefaultItemView, setSelectedText } =
  AsideSlice.actions;
