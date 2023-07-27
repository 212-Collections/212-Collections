import { Button, Select, Typography, theme } from "antd";
import { CollectionType } from "../../types/types";
import { useAppDispatch } from "../../redux/store";
import { setCollectionModal, setItemModal } from "../../redux/reducers/modal";
import { updateCollection } from "../../redux/reducers/collection";
import { PlusOutlined } from "@ant-design/icons";
import Avatar from "../media/avatar/Avatar";
import { deleteCollection } from "../../redux/reducers/list";
import Options from "../item/components/Options";
import { useTranslation } from "react-i18next";

export default function Header({
  collection,
  collectionId,
}: {
  collection: CollectionType;
  collectionId: string;
}) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function openNewItemModal() {
    dispatch(setItemModal({ open: true, type: "new" }));
  }

  function handleUpdateCollection(value: string) {
    dispatch(updateCollection({ _id: collectionId, view: value }));
  }

  function openEditCollection() {
    dispatch(
      setCollectionModal({
        open: true,
        type: "update",
        data: collection,
      })
    );
  }

  function deleteCollectionFunction() {
    dispatch(deleteCollection(collection));
  }

  return (
    <header id="header" style={{ backgroundColor: colorBgContainer }}>
      <div>
        <Avatar
          size={32}
          image={
            collection.icon || {
              type: "color",
              border: "rounded",
              render: "smooth",
              data: "#474b53",
            }
          }
        />
        <Typography.Title level={3}>{collection.name}</Typography.Title>
      </div>
      <div>
        <Button
          type="primary"
          onClick={openNewItemModal}
          icon={<PlusOutlined style={{ fontSize: "15px" }} />}
        >
          {t("page.collection.new")}
        </Button>
        <Select
          value={collection.view || "Select view"}
          onChange={handleUpdateCollection}
          options={[
            {
              value: "default",
              label: t("page.home.tabs.settings.view.default"),
            },
            {
              value: "card",
              label: t("page.home.tabs.settings.view.card"),
            },
            {
              value: "article",
              label: t("page.home.tabs.settings.view.article"),
            },
          ]}
        />
      </div>
      <div>
        <Options
          editFunction={openEditCollection}
          deleteFunction={deleteCollectionFunction}
          type="collection"
        />
      </div>
    </header>
  );
}
