import { Input, Modal, Form, Button, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  setCollectionModal,
  setImageModalCollection,
} from "../../../redux/reducers/modal";
import { deleteCollection, saveCollection } from "../../../redux/reducers/list";
import Avatar from "../../media/avatar/Avatar";
import { AvatarType } from "../../../types/types";
import { useEffect, useState } from "react";
import collection, {
  updateCollection,
} from "../../../redux/reducers/collection";
import ImageModal from "../image_modal/ImageModal";
import { useTranslation } from "react-i18next";

export default function CollectionModal() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const collectionModal = useAppSelector(
    (state) => state.modal.collectionModal
  );
  const collections = useAppSelector((state) => state.list.collections);
  const imageModalCollection = useAppSelector(
    (state) => state.modal.imageModalCollection
  );

  const [avatarData, setAvatarData] = useState<AvatarType>({
    border: "rounded",
    render: "smooth",
    type: "base64",
    background: "#00000000",
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
      background: "#00000000",
      type: "base64",
      data: "",
    });
  }

  async function submit(collection: any) {
    dispatch(setCollectionModal({ loading: true }));
    const newCollection = {
      ...collection,
      icon: { ...avatarData },
      view: "default",
      position:
        collections.length >= 1
          ? Math.max(...collections.map((c) => c.position || 0)) + 1
          : 0,
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
        collectionModal.type === "new"
          ? t("modal.collection.title.new")
          : t("modal.collection.title.edit")
      }
      open={collectionModal.open}
      onCancel={cancel}
      footer={[
        <Button key="reset" danger onClick={() => form.resetFields()}>
          {t("global.modal.reset")}
        </Button>,
        <Button key="cancel" onClick={cancel}>
          {t("global.modal.cancel")}
        </Button>,
        <Button
          type="primary"
          key="submit"
          onClick={() => form.submit()}
          icon={collectionModal.loading ? <LoadingOutlined /> : null}
        >
          {collectionModal.type === "update"
            ? t("global.modal.update")
            : t("global.modal.create")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name={"collection_modal"}
        onFinish={submit}
      >
        <div id="title">
          {avatarData.data === null || avatarData.data === "" ? (
            <Button
              onClick={() =>
                dispatch(
                  setImageModalCollection({
                    open: true,
                    type: "avatar",
                    name: "collection",
                    options: ["base64", "url", "emoji", "color"],
                  })
                )
              }
              style={{ width: "69px", height: "69px" }}
            >
              {t("modal.collection.form.icon")}
            </Button>
          ) : (
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                dispatch(
                  setImageModalCollection({
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
            label={t("modal.collection.form.name")}
            rules={[
              {
                required: true,
                message:
                  t("modal.collection.form.name") +
                  " " +
                  t("global.form.required"),
              },
            ]}
          >
            <Input maxLength={32} allowClear />
          </Form.Item>
        </div>
      </Form>

      <ImageModal
        name="collection"
        setImage={{ avatar: setAvatarData }}
        setImageModal={setImageModalCollection}
        imageModal={imageModalCollection}
      />
    </Modal>
  );
}
