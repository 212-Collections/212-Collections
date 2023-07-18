import { Button, Card, Popconfirm } from "antd";
import { accountType } from "../../types/types";
import { DeleteOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import "./account.scss";
import { useAppDispatch } from "../../redux/store";
import { UnregisterAccount, loginToken } from "../../redux/reducers/aside";

export default function Account({ account }: { account: accountType }) {
  const dispatch = useAppDispatch();

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
          title="Unregister the account"
          description="Are you sure you want to unregister this account?"
          onConfirm={deleteAccount}
          okText="Yes"
          cancelText="No"
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
