import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetMessageReducer, setMessage } from "./message";
import { resetModalReducer } from "./modal";
import { resetListReducer } from "./list";
import { resetCollectionReducer } from "./collection";
import { accountType } from "../../types/types";
import i18n from "../../i18n";

import { useTranslation } from "react-i18next";

export type ThemeState = "light" | "dark";
export type PageState = string;

interface SettingsType {
  defaultTheme: ThemeState;
  currentTheme: ThemeState;
  page: PageState;
  defaultItemView: string;
  username?: string | undefined;
  selectedText?: string;
  accounts: accountType[];
  lang: string;
}

const initialState: SettingsType = {
  currentTheme: "dark",
  defaultTheme: "dark",
  defaultItemView: "card",
  page: "home",
  accounts: [],
  lang: "en",
};

export const login = createAsyncThunk(
  "login/username",
  async (
    user: {
      username: string;
      password: string;
      cluster: string;
      database: string;
    },
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
      const account = {
        username: data.username,
        cluster: data.cluster,
        token: data.token,
        database: data.database,
      };
      const localStorageName = "212-collections-accounts";
      var accounts = JSON.parse(localStorage.getItem(localStorageName) || "[]");
      var existingAccount = accounts.findIndex(
        (acc: accountType) => acc.database === account.database
      );
      if (existingAccount !== -1) {
        accounts[existingAccount] = account;
      } else {
        accounts.push(account);
      }
      localStorage.setItem(localStorageName, JSON.stringify(accounts));
      thunkAPI.dispatch(
        setMessage({
          title: i18n.t("message.login.success.title"),
          description: i18n.t("message.login.success.content") + " " + data.username,
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title: i18n.t("message.login.error.title"),
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
          title: i18n.t("message.login.success.title"),
          description: i18n.t("message.login.success.content") + " " + data.username,
          type: "success",
        })
      );
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title: i18n.t("message.login.error.title"),
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
  try {
  } catch (error) {
    console.log(error);
  }

  const response = await fetch("http://localhost:49449/logout", {
    method: "POST",
  });
  const data = await response.json();
  if (data.logout) {
    thunkAPI.dispatch(
      setMessage({
        title: i18n.t("message.logout.success.title"),
        description: i18n.t("message.logout.success.content"),
        type: "success",
      })
    );
    thunkAPI.dispatch(resetModalReducer());
    thunkAPI.dispatch(resetMessageReducer());
    thunkAPI.dispatch(resetListReducer());
    thunkAPI.dispatch(resetCollectionReducer());
    thunkAPI.dispatch(resetSettingsReducer());
    return data;
  } else {
    thunkAPI.dispatch(
      setMessage({
        title: i18n.t("message.logout.error.content"),
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
    if (data.defaultTheme) {
      thunkAPI.dispatch(setDefaultTheme(data.defaultTheme));
      if (data.defaultItemView)
        thunkAPI.dispatch(setDefaultItemView(data.defaultItemView));
      if (data.lang) thunkAPI.dispatch(setLang(data.lang));
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title: i18n.t("message.settings.fetch.error.title"),
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
    if (data.defaultTheme) {
      return data;
    } else {
      thunkAPI.dispatch(
        setMessage({
          title: i18n.t("message.settings.update.error.title"),
          description: data.message,
          type: "error",
        })
      );
      return null;
    }
  }
);

export const SettingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setDefaultTheme: (state, action: PayloadAction<ThemeState>) => {
      const theme = action.payload;
      state.defaultTheme = theme;
      localStorage.setItem("212-collections-theme", theme);
      state.currentTheme = theme;
    },
    setCurrentTheme: (state, action: PayloadAction<ThemeState>) => {
      const theme = action.payload;
      state.currentTheme = theme;
    },
    setDefaultItemView: (state, action: PayloadAction<string>) => {
      state.defaultItemView = action.payload;
    },
    setLang: (state, action: PayloadAction<string>) => {
      const lang = action.payload;
      state.lang = lang;
      localStorage.setItem("212-collections-lang", lang);
      i18n.changeLanguage(lang);
    },
    setPage: (state, action: PayloadAction<string>) => {
      state.page = action.payload;
    },
    setUsername: (state, action: PayloadAction<string | undefined>) => {
      state.username = action.payload;
    },
    resetSettingsReducer: (state) => {
      state = initialState;
    },
    setSelectedText: (state, action) => {
      state.selectedText = action.payload;
    },
    getSavedAccounts: (state) => {
      const localStorageName = "212-collections-accounts";
      var localStorageAccounts = JSON.parse(
        localStorage.getItem(localStorageName) || "[]"
      );
      state.accounts = localStorageAccounts;
    },
    UnregisterAccount: (state, action) => {
      const localStorageName = "212-collections-accounts";
      var accounts = JSON.parse(localStorage.getItem(localStorageName) || "[]");
      accounts = accounts.filter(
        (acc: accountType) => acc.database !== action.payload
      );
      state.accounts = accounts;
      localStorage.setItem(localStorageName, JSON.stringify(accounts));
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
          const { defaultTheme, defaultItemView, lang } = action.payload;
          state.defaultTheme = defaultTheme;
          state.defaultItemView = defaultItemView;
          state.lang = lang;
        }
      }
    );
    builder.addCase(
      saveSettings.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload;
        if (data) {
          state.defaultTheme = data.defaultTheme;
          state.defaultItemView = data.defaultItemView;
          state.lang = data.lang;
        }
      }
    );
  },
});

export default SettingsSlice.reducer;
export const {
  setCurrentTheme,
  setDefaultTheme,
  setPage,
  resetSettingsReducer,
  setDefaultItemView,
  setSelectedText,
  UnregisterAccount,
  getSavedAccounts,
  setLang,
} = SettingsSlice.actions;
