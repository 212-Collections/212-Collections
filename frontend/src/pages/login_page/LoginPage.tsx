import { Button, Divider, Form, Input, Layout, Space, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getSavedAccounts, login, loginToken } from "../../redux/reducers/aside";
import { useEffect, useState } from "react";
import { accountType } from "../../types/types";
import Account from "../../components/account/Account";

export default function LoginPage() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(state => state.aside.accounts);

  function submit(e: any) {
    let clusterValue = e.cluster;
    if (!clusterValue.endsWith(".mongodb.net")) {
      clusterValue += ".mongodb.net";
    }
    const loginData = { ...e, cluster: clusterValue };
    dispatch(login(loginData));
  }

  useEffect(() => {
    dispatch(getSavedAccounts());
  }, []);

  return (
    <Layout
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Space style={{ alignItems: "flex-start" }} size={64}>
        <div>
          <Typography.Title level={3}>New login</Typography.Title>
          <Form
            style={{ maxWidth: "520px", marginBottom: "16px" }}
            form={form}
            layout="vertical"
            name={"login_form"}
            onFinish={submit}
            requiredMark="optional"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Username is required",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
              ]}
            >
              <Input.Password allowClear />
            </Form.Item>
            <Form.Item
              name="database"
              label="Database name"
              rules={[
                {
                  required: true,
                  message: "Database name is required",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name="cluster"
              label="Cluster"
              rules={[
                {
                  required: true,
                  message: "Cluster is required",
                },
              ]}
            >
              <Input addonAfter=".mongodb.net" allowClear />
            </Form.Item>
            <Button type="primary" onClick={() => form.submit()}>
              Login
            </Button>
          </Form>
          <Typography.Link
            href="https://github.com/212-collections/212-collections/wiki/create-a-database"
            target="_blank"
          >
            No account? Follow the instructions here
          </Typography.Link>
        </div>
        {accounts.length> 0 ? <div>
          <Typography.Title level={3}>Direct login</Typography.Title>
          <ul>
            {accounts.map((account, i) => (
              <li key={i}>
                <Account account={account} />
              </li>
            ))}
          </ul>
        </div> : null}
      </Space>
    </Layout>
  );
}
