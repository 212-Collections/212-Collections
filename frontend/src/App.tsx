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
import { useEffect } from "react";
import {
  fetchSettings,
  setPage,
  setSelectedText,
} from "./redux/reducers/aside";
import SearchPage from "./pages/search_page/SearchPage";

export default function App() {
  const page = useAppSelector((state) => state.aside.page);
  const theme = useAppSelector((state) => state.aside.theme);
  const username = useAppSelector((state) => state.aside.username);
  const dispatch = useAppDispatch();

  const combineDarkTheme = {
    ...darkTheme,
    ...customDarkTheme,
  };

  const combineLightTheme = {
    ...lightTheme,
    ...customLightTheme,
  };

  useEffect(() => {
    dispatch(fetchSettings());
  }, []);

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "f") {
      event.preventDefault();
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString() : "";
      dispatch(setSelectedText(selectedText));
      dispatch(setPage("search"));
    }
  });

  return (
    <ConfigProvider
      theme={{
        token: theme === "dark" ? combineDarkTheme : combineLightTheme,
      }}
    >
      {username ? (
        <>
          <Layout
            id="App"
            className={theme === "light" ? "light" : "dark"}
            style={{ height: "100%" }}
          >
            <Aside />
            <Layout>
              {page === "home" ? <HomePage /> : null}
              {page === "search" ? <SearchPage /> : null}
              {page.split("-")[0] === "collection" ? (
                <CollectionPage collectionId={page.split("-")[1]} />
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
