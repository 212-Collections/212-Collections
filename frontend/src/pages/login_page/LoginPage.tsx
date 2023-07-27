import { Button, Divider, Form, Input, Layout, Space, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  getSavedAccounts,
  login,
  loginToken,
} from "../../redux/reducers/settings";
import { useEffect, useState } from "react";
import { accountType } from "../../types/types";
import Account from "../../components/account/Account";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((state) => state.settings.accounts);

  const { t } = useTranslation();

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
          <Typography.Title level={3}>
            {t("page.login.type.classic")}
          </Typography.Title>
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
              label={t("page.login.form.username")}
              rules={[
                {
                  required: true,
                  message:
                    t("page.login.form.username") +
                    " " +
                    t("global.form.required"),
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name="password"
              label={t("page.login.form.password")}
              rules={[
                {
                  required: true,
                  message:
                    t("page.login.form.password") +
                    " " +
                    t("global.form.required"),
                },
              ]}
            >
              <Input.Password allowClear />
            </Form.Item>
            <Form.Item
              name="database"
              label={t("page.login.form.database")}
              rules={[
                {
                  required: true,
                  message:
                    t("page.login.form.database") +
                    " " +
                    t("global.form.required"),
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name="cluster"
              label={t("page.login.form.cluster")}
              rules={[
                {
                  required: true,
                  message:
                    t("page.login.form.cluster") +
                    " " +
                    t("global.form.required"),
                },
              ]}
            >
              <Input addonAfter=".mongodb.net" allowClear />
            </Form.Item>
            <Button type="primary" onClick={() => form.submit()}>
              {t("page.login.form.submit")}
            </Button>
          </Form>
          <Typography.Link
            href="https://github.com/212-collections/212-collections/wiki/create-a-database"
            target="_blank"
          >
            {t("page.login.guide")}
          </Typography.Link>
        </div>
        {accounts.length > 0 ? (
          <div>
            <Typography.Title level={3}>
              {t("page.login.type.direct")}
            </Typography.Title>
            <ul>
              {accounts.map((account, i) => (
                <li key={i}>
                  <Account account={account} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Space>
    </Layout>
  );
}
