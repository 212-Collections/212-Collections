import {
  Button,
  Dropdown,
  Layout,
  Popconfirm,
  Select,
  Typography,
  theme,
} from "antd";
import { CollectionType } from "../../types/types";
import { useAppDispatch } from "../../redux/store";
import { setCollectionModal, setItemModal } from "../../redux/reducers/modal";
import { updateCollection } from "../../redux/reducers/collection";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Avatar from "../media/avatar/Avatar";
import { deleteCollection } from "../../redux/reducers/list";
import Options from "../item/components/Options";

export default function Header({
  collection,
  collectionId,
}: {
  collection: CollectionType;
  collectionId: string;
}) {
  const dispatch = useAppDispatch();

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
          New element
        </Button>
        <Select
          value={collection.view || "Select view"}
          onChange={handleUpdateCollection}
          options={[
            {
              value: "antd-card",
              label: "AntdCard",
            },
            {
              value: "article",
              label: "Article",
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
