import { Button, Divider, Layout, theme } from "antd";
import { HomeOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { setPage, setTheme } from "../../redux/reducers/aside";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import CollectionsList from "./collections_list/CollectionsList";
import { setCollectionModal } from "../../redux/reducers/modal";
import { useEffect } from "react";

export default function Aside() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.aside.theme);


  const {
    token: { colorBgContainer, colorFillTertiary, colorFillQuaternary },
  } = theme.useToken();

  function switchTheme() {
    if (currentTheme === "dark") {
      dispatch(setTheme("light"));
    } else {
      dispatch(setTheme("dark"));
    }
  }

  function setHomePage() {
    dispatch(setPage("home"));
  }

  const LightIcon = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="grid"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"
          strokeWidth="0"
          fill="currentColor"
        />
      </svg>
    </span>
  );

  const darkIcon = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="grid"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z"
          strokeWidth="0"
          fill="currentColor"
        />
      </svg>
    </span>
  );

  const homeIcon = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ffffff"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
      </svg>
    </span>
  );

  const newIcon = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ffffff"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5l0 14" />
        <path d="M5 12l14 0" />
      </svg>
    </span>
  );

  return (
    <Layout.Sider
      width={250}
      style={{ backgroundColor: colorBgContainer }}
      id="aside"
    >
      {" "}
      <div
        style={currentTheme == "dark" ? {
          backgroundColor: colorFillQuaternary,
          height: "100%",
        } : {}}
      >
        <div id="buttons">
          <div>
            <Button
              type="primary"
              onClick={setHomePage}
              icon={<HomeOutlined style={{ fontSize: "16px" }} />}
            />
            <Button
              type="text"
              icon={<PlusOutlined style={{ fontSize: "22px" }} />}
              // icon={newIcon}
              onClick={() =>
                dispatch(setCollectionModal({ open: true, type: "new" }))
              }
            />
          </div>
          <Button
            type="text"
            onClick={switchTheme}
            icon={currentTheme === "dark" ? darkIcon : LightIcon}
            aria-label="Switch Theme"
          />
        </div>
        <Divider style={{ marginTop: "0", marginBottom: "12px" }} />

        <CollectionsList />
      </div>
    </Layout.Sider>
  );
}
