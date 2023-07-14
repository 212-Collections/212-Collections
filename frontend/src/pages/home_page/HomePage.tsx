import {
  Button,
  Card,
  Collapse,
  Divider,
  Form,
  Layout,
  Select,
  Space,
  Typography,
  theme,
} from "antd";
import Icon from "../../components/media/icon/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useEffect, useState } from "react";
import Avatar from "../../components/media/avatar/Avatar";
import { logout, saveSettings, setPage } from "../../redux/reducers/aside";

export default function HomePage() {
  const [collections, setCollections] = useState([]);
  const [size, setSize] = useState(0);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const settings = useAppSelector((state) => state.aside.settings);
  const username = useAppSelector((state) => state.aside.username);

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

  useEffect(() => {
    form.setFieldsValue(settings);
  }, []);

  function setCollectionPage(collectionId: string) {
    dispatch(setPage("collection-" + collectionId));
  }

  function handleChange() {
    form.submit();
  }

  function submit(value: any) {
    dispatch(saveSettings(value));
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
      key: "1",
      label: "Settings",
      children: (
        <Form form={form} layout="vertical" name={"settings"} onFinish={submit}>
          <div style={{ display: "inline-block" }}>
            <Form.Item name="theme" label="Default theme">
              <Select onChange={handleChange}>
                <Select.Option value="dark" label="Dark">
                  <Space>
                    {darkIcon}
                    Dark
                  </Space>
                </Select.Option>
                <Select.Option value="light" label="Light">
                  <Space>
                    {LightIcon}
                    Light
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="itemview" label="Default items view">
              <Select onChange={handleChange}>
                <Select.Option value="card" label="Card">
                  <Space>Card</Space>
                </Select.Option>
                <Select.Option value="article" label="Article">
                  <Space>Article</Space>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Collections overview",
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
                      {collection.elementCount + " elements"}
                    </Typography.Text>
                    <Button onClick={() => setCollectionPage(collection._id)}>
                      Open
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
          <Typography.Title level={3}>Home</Typography.Title>
          <Typography.Text>{(size + 1).toFixed(1)} MB / 512 MB</Typography.Text>
        </div>
        <div>
          <Typography.Text>Connected as {username}</Typography.Text>
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
            Logout
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
        <Collapse defaultActiveKey={[1, 2]} ghost items={items} />
      </Layout.Content>
    </>
  );
}
