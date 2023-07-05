import { Input, Modal, Form, Button, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  setCollectionModal,
  setImageModal,
} from "../../../redux/reducers/modal";
import { deleteCollection, saveCollection } from "../../../redux/reducers/list";
import Avatar from "../../media/avatar/Avatar";
import { AvatarType } from "../../../types/types";
import { useEffect, useState } from "react";
import ImageModal from "../image_modal/ImageModal";
import { updateCollection } from "../../../redux/reducers/collection";

export default function CollectionModal() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const collectionModal = useAppSelector(
    (state) => state.modal.collectionModal
  );
  const collections = useAppSelector((state) => state.list.collections);

  const [avatarData, setAvatarData] = useState<AvatarType>({
    border: "rounded",
    render: "smooth",
    type: "base64",
    data: "",
  });

  useEffect(() => {
    if (!collectionModal.open) return;
    const { data, type } = collectionModal;
    if (type === "update" && data) {
      const { name, icon } = data;
      form.setFieldsValue({
        name,
      });
      setAvatarData(
        icon || {
          border: "rounded",
          render: "smooth",
          type: "base64",
          data: "",
        }
      );
    } else {
      reset();
    }
  }, [collectionModal]);

  function cancel() {
    dispatch(setCollectionModal({ open: false }));
  }

  function reset() {
    form.resetFields();
    setAvatarData({
      border: "rounded",
      render: "smooth",
      type: "base64",
      data: "",
    });
  }

  async function submit(collection: any) {
    dispatch(setCollectionModal({ loading: true }));
    const newCollection = {
      ...collection,
      icon: { ...avatarData },
      position: Math.max(...collections.map(c => c.position || 0))+1,
    };
    try {
      let resultAction;
      if (collectionModal.type === "new") {
        resultAction = await dispatch(saveCollection(newCollection));
      } else if (collectionModal.type === "update") {
        resultAction = await dispatch(
          updateCollection({ ...newCollection, _id: collectionModal.data._id })
        );
      }
      if (resultAction && resultAction.payload) {
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal
      title={
        collectionModal.type === "new" ? "New Collection" : "Edit Collection"
      }
      open={collectionModal.open}
      onCancel={cancel}
      footer={[
        <Button key="reset" danger onClick={() => form.resetFields()}>
          Reset
        </Button>,
        <Button key="cancel" onClick={cancel}>
          Cancel
        </Button>,
        <Button
          type="primary"
          key="submit"
          onClick={() => form.submit()}
          icon={collectionModal.loading ? <LoadingOutlined /> : null}
        >
          {collectionModal.type === "update" ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name={"collection_modal"}
        onFinish={submit}
      >
        {/* <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Name is required",
            },
          ]}
          tooltip="The name of the new collection"
        >
          <Input maxLength={32} allowClear />
        </Form.Item> */}
        <div id="title">
          {avatarData.data === null || avatarData.data === "" ? (
            <Button
              onClick={() =>
                dispatch(
                  setImageModal({
                    open: true,
                    type: "avatar",
                    name: "collection",
                    options: ["base64", "url", "emoji", "color"],
                  })
                )
              }
              style={{ width: "69px", height: "69px" }}
            >
              Icon
            </Button>
          ) : (
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                dispatch(
                  setImageModal({
                    open: true,
                    type: "avatar",
                    options: ["base64", "url", "emoji", "color"],
                    imageInit: avatarData,
                  })
                )
              }
            >
              <Avatar size={64} image={avatarData} />
            </div>
          )}
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input maxLength={32} allowClear />
          </Form.Item>
        </div>
      </Form>
      <ImageModal name="collection" setImage={{ avatar: setAvatarData }} />
    </Modal>
  );
}
