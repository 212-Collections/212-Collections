import { Button, Typography } from "antd";
import Options from "./Options";
import Avatar from "../../media/avatar/Avatar";

export default function Title({
  title,
  version,
  editFunction,
  deleteFunction,
  image,
}: any) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        height: "32px",
      }}
    >
      <Avatar size={32} image={image} />
      <Typography.Title
        ellipsis
        level={3}
        style={{ flex: "auto", margin: 0, flexGrow: 0 }}
      >
        {title}
      </Typography.Title>
      <Typography.Text type="secondary" style={{ flexGrow: 1 }}>
        {version}
      </Typography.Text>
      <Options
        editFunction={editFunction}
        deleteFunction={deleteFunction}
        type="item"
      />
    </div>
  );
}