import { Button, Form, Input, Layout, Space, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { login, loginToken } from "../../redux/reducers/aside";
import { useEffect } from "react";

export default function LoginPage() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  function submit(e: any) {
    let clusterValue = e.cluster;
    if (!clusterValue.endsWith(".mongodb.net")) {
      clusterValue += ".mongodb.net";
    }
    dispatch(login({ ...e, cluster: clusterValue }));
  }

  useEffect(() => {
    if (localStorage.getItem("username")) {
      form.setFieldValue("username", localStorage.getItem("username"));
    }
    if (localStorage.getItem("cluster")) {
      form.setFieldValue(
        "cluster",
        localStorage.getItem("cluster")?.split(".mongodb.net")[0]
      );
    }
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(loginToken(token));
    }
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
      <Space direction="vertical" size="large">
        <Form
          style={{ maxWidth: "520px" }}
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
          No database? Follow the instructions here
        </Typography.Link>
      </Space>
    </Layout>
  );
}
