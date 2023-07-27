import {
  Button,
  Card,
  Collapse,
  Divider,
  Form,
  Layout,
  Select,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import Icon from "../../components/media/icon/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useEffect, useState } from "react";
import Avatar from "../../components/media/avatar/Avatar";
import {
  ThemeState,
  logout,
  saveSettings,
  setLang,
  setPage,
} from "../../redux/reducers/settings";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import Settings from "../../components/settings/Settings";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";

export default function HomePage() {
  const [collections, setCollections] = useState([]);
  const [size, setSize] = useState(0);
  const [newRelease, setNewRelease] = useState(false);
  const [latestRelease, setLatestRelease] = useState("");
  const [loadingCheckRelease, setLoadingCheckRelease] = useState(false);
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.settings.username);
  const { t } = useTranslation();
  const packageData = require("../../../package.json");

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    fetch("http://localhost:49449/collection/homelist")
      .then((res) => res.json())
      .then((obj) => setCollections(obj));
  }, []);

  useEffect(() => {
    fetch("http://localhost:49449/data/size")
      .then((res) => res.json())
      .then((obj: { size: number }) => {
        setSize(obj.size);
      });
  }, [username]);

  function setCollectionPage(collectionId: string) {
    dispatch(setPage("collection-" + collectionId));
  }

  function checkRelease() {
    setLoadingCheckRelease(true);
    setNewRelease(false);
    fetch(
      "https://api.github.com/repos/212-collections/212-collections/releases"
    )
      .then((res) => res.json())
      .then((arr) => {
        setLoadingCheckRelease(false);
        const latest = arr[0].tag_name;
        setLatestRelease(latest);
        if (latest !== packageData.version) {
          setNewRelease(true);
        }
      });
  }

  function openUpdate() {
    window.open(
      "https://github.com/212-Collections/212-Collections/releases/tag/" +
        latestRelease
    );
  }

  const items = [
    // {
    //   key: "0",
    //   label: "Support",
    //   children: (
    //     <a
    //       href="https://paypal.me/PierreLHOSTE?country.x=FR&locale.x=fr_FR"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Support me ! ❤️
    //     </a>
    //   ),
    // },
    {
      key: 0,
      label: t("page.home.tabs.about.title"),
      children: (
        <Space direction="vertical">
          <div>
            {t("page.home.tabs.about.version")} :{" "}
            <Tag>{packageData.version}</Tag>
          </div>
          <Space>
            <Button onClick={checkRelease}>
              {t("page.home.tabs.about.check")}
            </Button>
            {loadingCheckRelease ? (
              <>
                <LoadingOutlined />
              </>
            ) : null}
            {newRelease ? (
              <>
                <Typography.Text>
                  {t("page.home.tabs.about.update")}
                </Typography.Text>
                <Button
                  onClick={openUpdate}
                  type="text"
                  icon={<DownloadOutlined />}
                />
              </>
            ) : null}
          </Space>
        </Space>
      ),
    },
    {
      key: "1",
      label: t("page.home.tabs.settings.title"),
      children: <Settings />,
    },
    {
      key: "2",
      label: t("page.home.tabs.overview.title"),
      children: (
        <Space style={{ flexWrap: "wrap" }}>
          {collections.length > 0
            ? collections?.map((collection: any) => (
                <Card key={collection.name}>
                  <Space direction="vertical">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <Avatar size={24} image={collection.icon} />
                      <Typography.Title
                        ellipsis
                        level={3}
                        style={{ flex: "auto", margin: 0, flexGrow: 0 }}
                      >
                        {collection.name}
                      </Typography.Title>
                    </div>
                    <Typography.Text type="secondary" style={{ flexGrow: 1 }}>
                      {collection.elementCount +
                        " " +
                        t("page.home.tabs.overview.element")}
                    </Typography.Text>
                    <Button onClick={() => setCollectionPage(collection._id)}>
                      {t("page.home.tabs.overview.open")}
                    </Button>
                  </Space>
                </Card>
              ))
            : null}
        </Space>
      ),
    },
  ];

  function disconnect() {
    dispatch(logout());
  }

  return (
    <>
      <header id="header" style={{ backgroundColor: colorBgContainer }}>
        <div style={{ alignItems: "baseline" }}>
          <Typography.Title level={3}>{t("page.home.title")}</Typography.Title>
          <Typography.Text>{size.toFixed(1)} MB / 512 MB</Typography.Text>
        </div>
        <div>
          <Typography.Text>
            {t("page.home.logged")} {username}
          </Typography.Text>
          <Button
            type="default"
            icon={
              <Icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M9 12h12l-3 -3" />
                  <path d="M18 15l3 -3" />
                </svg>
              </Icon>
            }
            onClick={disconnect}
          >
            {t("page.home.logout")}
          </Button>
        </div>
      </header>
      <Divider
        style={{
          marginTop: "0",
          marginBottom: 0,
          backgroundColor: colorBgContainer,
        }}
      />
      <Layout.Content style={{ overflowY: "auto" }}>
        <Collapse defaultActiveKey={[0, 1, 2]} ghost items={items} />
      </Layout.Content>
    </>
  );
}
