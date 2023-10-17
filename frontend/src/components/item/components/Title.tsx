import { Typography } from "antd";
import Options from "./Options";
import Avatar from "../../media/avatar/Avatar";

export default function Title({
  title,
  version,
  editFunction,
  deleteFunction,
  image,
}: any) {
  const titleGrow = version && version !== "" ? 0 : 1;

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
        style={{ margin: 0, flexGrow: titleGrow, flexShrink: 1 }}
      >
        {title}
      </Typography.Title>
      {version && version !== "" ? (
        <Typography.Text type="secondary" style={{ flexGrow: 1 }}>
          {version}
        </Typography.Text>
      ) : null}
      {editFunction && deleteFunction ? (
        <Options
          editFunction={editFunction}
          deleteFunction={deleteFunction}
          type="item"
        />
      ) : null}
    </div>
  );
}
