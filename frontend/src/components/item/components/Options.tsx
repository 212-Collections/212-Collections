import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Popconfirm } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Options({ editFunction, deleteFunction, type }: any) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { t } = useTranslation();

  const items = [
    {
      label:
        type === "item"
          ? t("page.collection.item.edit")
          : t("page.collection.edit"),
      key: "edit",
      icon: <EditOutlined />,
    },
    {
      label:
        type === "item"
          ? t("page.collection.item.delete")
          : t("page.collection.delete"),
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
        title={
          type === "item"
            ? t("page.collection.item.popup.title")
            : t("page.collection.popup.title")
        }
        description={
          type === "item"
            ? t("page.collection.item.popup.message")
            : t("page.collection.popup.message")
        }
        onConfirm={() => deleteFunction()}
        okText={t("global.popup.ok")}
        cancelText={t("global.popup.cancel")}
        key="delete"
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
