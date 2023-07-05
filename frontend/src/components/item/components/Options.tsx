import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";

export default function Options({ editFunction, deleteFunction, type }: any) {
  const [confirmVisible, setConfirmVisible] = useState(false);

  const items = [
    {
      label: "Edit collection",
      key: "edit",
      icon: <EditOutlined />,
    },
    {
      label: "Delete " + type,
      key: "delete",
      danger: true,
      icon: <DeleteOutlined />,
    },
  ];

  function handleMenuClick(e: any) {
    const key = e.key;
    switch (key) {
      case "edit":
        editFunction();
        break;
      case "delete":
        setConfirmVisible(true);
        break;
    }
  }

  return (
    <>
      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick,
        }}
        trigger={["click"]}
      >
        <Button style={{ flexShrink: 0 }} type="text" icon={<MoreOutlined />} />
      </Dropdown>
      <Popconfirm
        title={"Delete " + type}
        description={`Are you sure you want to delete this ${type}?`}
        onConfirm={() => deleteFunction()}
        okText="Yes"
        cancelText="No"
        key="delete"
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
