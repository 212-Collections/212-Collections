import { Button, Card, Popconfirm } from "antd";
import { accountType } from "../../types/types";
import { DeleteOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import "./account.scss";
import { useAppDispatch } from "../../redux/store";
import { UnregisterAccount, loginToken } from "../../redux/reducers/settings";
import { useTranslation } from "react-i18next";

export default function Account({ account }: { account: accountType }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { username, token, database, cluster } = account;
  function directLogin() {
    dispatch(loginToken(token));
  }
  function deleteAccount() {
    dispatch(UnregisterAccount(database));
  }

  return (
    <Card
      bordered={false}
      className="account"
      extra={
        <Popconfirm
          title={t("page.login.popup.title")}
          description={t("page.login.popup.message")}
          onConfirm={deleteAccount}
          okText={t("global.popup.ok")}
          cancelText={t("global.popup.cancel")}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      }
      title={<div onClick={directLogin}>{database}</div>}
    >
      <Card.Meta
        description={
          <>
            <UserOutlined /> {username} <br />
            {cluster}
          </>
        }
      />
    </Card>
  );
}
