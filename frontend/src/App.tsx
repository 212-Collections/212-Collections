import { ConfigProvider, theme as AntdTheme, Layout } from "antd";
import CollectionModal from "./components/modal/collection_modal/CollectionModal";
import { useAppDispatch, useAppSelector } from "./redux/store";
import Message from "./components/modal/MessageNotification";
import customDarkTheme from "./theme/custom-dark-theme.json";
import darkTheme from "./theme/dark-theme.json";
import lightTheme from "./theme/light-theme.json";
import customLightTheme from "./theme/custom-light-theme.json";
import Aside from "./components/aside/Aside";
import CollectionPage from "./pages/collection_page/CollectionPage";
import LoginPage from "./pages/login_page/LoginPage";
import HomePage from "./pages/home_page/HomePage";
import { useCallback, useEffect } from "react";
import {
  ThemeState,
  fetchSettings,
  setLang,
  setPage,
  setSelectedText,
  setCurrentTheme,
} from "./redux/reducers/settings";
import SearchPage from "./pages/search_page/SearchPage";

const combineDarkTheme = {
  ...darkTheme,
  ...customDarkTheme,
};

const combineLightTheme = {
  ...lightTheme,
  ...customLightTheme,
};

export default function App() {
  const page = useAppSelector((state) => state.settings.page);
  const currentTheme = useAppSelector((state) => state.settings.currentTheme);
  const username = useAppSelector((state) => state.settings.username);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (username) {
      dispatch(fetchSettings());
    } else {
      const lang = localStorage.getItem("212-collections-lang") as string;
      if (lang) {
        dispatch(setLang(lang));
      }
      const localTheme = localStorage.getItem(
        "212-collections-theme"
      ) as ThemeState;
      if (localTheme) {
        dispatch(setCurrentTheme(localTheme));
      }
    }
  }, [username]);

  const handleCtrlF = useCallback(
    (event: any) => {
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        const selection = window.getSelection();
        const selectedText = selection ? selection.toString() : "";
        dispatch(setSelectedText(selectedText));
        dispatch(setPage("search"));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleCtrlF);
    return () => {
      document.removeEventListener("keydown", handleCtrlF);
    };
  }, [handleCtrlF]);

  const pageTokens = page.split("-");

  return (
    <ConfigProvider
      theme={{
        token: currentTheme === "dark" ? combineDarkTheme : combineLightTheme,
      }}
    >
      {username ? (
        <>
          <Layout
            id="App"
            className={currentTheme === "light" ? "light" : "dark"}
            style={{ height: "100%" }}
          >
            <Aside />
            <Layout>
              {page === "home" ? <HomePage /> : null}
              {page === "search" ? <SearchPage /> : null}
              {pageTokens[0] === "collection" ? (
                <CollectionPage collectionId={pageTokens[1]} />
              ) : null}
            </Layout>
          </Layout>
          <CollectionModal />
        </>
      ) : (
        <LoginPage />
      )}
      <Message />
    </ConfigProvider>
  );
}
