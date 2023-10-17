import {
  Input,
  Modal,
  Form,
  Button,
  DatePicker,
  Select,
  ColorPicker,
  Space,
} from "antd";
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  saveItem,
  updateItem,
  deleteItem,
} from "../../../redux/reducers/collection";
import ImageModalItem from "../image_modal/ImageModal";
import { useEffect, useState } from "react";
import Avatar from "../../media/avatar/Avatar";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { setImageModalItem, setItemModal } from "../../../redux/reducers/modal";
import Image from "../../media/image/Image";
import dayjs from "dayjs";
import { AvatarType, ImageType } from "../../../types/types";
import ImageModal from "../image_modal/ImageModal";
import { useTranslation } from "react-i18next";
import { setMessage } from "../../../redux/reducers/message";

export default function ItemModal({ collectionId }: { collectionId: string }) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const itemModal = useAppSelector((state) => state.modal.itemModal);
  const imageModalItem = useAppSelector((state) => state.modal.imageModalItem);

  const [avatarData, setAvatarData] = useState<AvatarType>(
    itemModal.data
      ? itemModal.data.icon
      : {
          border: "rounded",
          render: "smooth",
          type: "base64",
          data: null,
        }
  );
  const [imageData, setImageData] = useState<ImageType>(
    itemModal.data
      ? itemModal.data.image
      : {
          render: "smooth",
          type: "base64",
          data: "",
          size: "width",
        }
  );

  // OK
  useEffect(() => {
    if (!itemModal.open) return;
    const { data, type } = itemModal;
    if (type === "update" && data) {
      const { date, title, description, tags, version, link, image, icon } =
        data;
      form.setFieldsValue({
        date: date !== "" ? dayjs(date) : null,
        title,
        description,
        tags,
        version,
        link,
      });
      setImageData(image);
      setAvatarData(icon);
    } else {
      // reset();
    }
  }, [itemModal]);

  function cancel() {
    dispatch(setItemModal({ open: false }));
    reset();
  }
  // OK
  async function submit(item: any) {
    dispatch(setItemModal({ loading: true }));
    const newItem = {
      ...item,
      collection_id: collectionId,
      icon: { ...avatarData },
      image: { ...imageData },
      color1: item.color1?.toHexString() || undefined,
      color2: item.color2?.toHexString() || undefined,
    };
    newItem.date = newItem.date ? dayjs(newItem.date).format("YYYY-MM-DD") : "";
    try {
      let resultAction;
      if (itemModal.type === "new") {
        resultAction = await dispatch(saveItem(newItem));
      } else if (itemModal.type === "update") {
        resultAction = await dispatch(
          updateItem({ ...newItem, _id: itemModal.data._id })
        );
      }
      if (resultAction && resultAction.payload) {
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  }

  function reset() {
    form.resetFields();
    setImageData({
      render: "smooth",
      type: "base64",
      background: "#00000000",
      data: "",
    });
    setAvatarData({
      border: "rounded",
      render: "smooth",
      type: "base64",
      background: "#00000000",
      data: "",
    });
  }

  function getWebSiteData() {
    const url = form.getFieldValue("link");
    fetch("http://localhost:49449/webdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          dispatch(
            setMessage({
              title: data.error,
              description: data.message,
              type: "error",
            })
          );
        }

        form.setFieldsValue({
          title: data.title,
          description: data.description,
        });
        if (data.icon)
          setAvatarData({
            border: "rounded",
            render: "smooth",
            background: "#00000000",
            data: data.icon,
            type: "url",
          });
        if (data.image)
          setImageData({
            render: "smooth",
            data: data.image,
            background: "#00000000",
            type: "url",
          });
      });
  }

  const modalFooter = [
    <Button key="reset" danger onClick={reset}>
      {t("global.modal.reset")}
    </Button>,
    <Button key="cancel" onClick={cancel}>
      {t("global.modal.cancel")}
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => form.submit()}
      icon={itemModal.loading ? <LoadingOutlined /> : null}
    >
      {itemModal.type === "update"
        ? t("global.modal.update")
        : t("global.modal.create")}
    </Button>,
  ];

  return (
    <>
      <Modal
        title={
          itemModal.type === "new"
            ? t("modal.item.title.new")
            : t("modal.item.title.edit")
        }
        open={itemModal.open}
        onCancel={cancel}
        footer={modalFooter}
      >
        <Form
          form={form}
          layout="vertical"
          name={"item_modal"}
          onFinish={submit}
        >
          <div id="title">
            {avatarData.data === null || avatarData.data === "" ? (
              <Button
                onClick={() =>
                  dispatch(
                    dispatch(
                      setImageModalItem({
                        name: "item",
                        open: true,
                        type: "avatar",
                        options: ["base64", "url", "emoji", "color"],
                      })
                    )
                  )
                }
                style={{ width: "69px", height: "69px" }}
              >
                {t("modal.item.form.icon.label")}
              </Button>
            ) : (
              <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch(
                    dispatch(
                      setImageModalItem({
                        name: "item",
                        open: true,
                        type: "avatar",
                        options: ["base64", "url", "emoji", "color"],
                        imageInit: avatarData,
                      })
                    )
                  )
                }
              >
                <Avatar size={64} image={avatarData} />
              </div>
            )}
            <Form.Item
              name="title"
              label={t("modal.item.form.title.label")}
              rules={[
                {
                  required: true,
                  message:
                    t("modal.item.form.title.label") +
                    " " +
                    t("global.form.required"),
                },
              ]}
              tooltip={t("modal.item.form.icon.tooltip")}
            >
              <Input maxLength={32} allowClear />
            </Form.Item>
            <Form.Item
              name="version"
              label={t("modal.item.form.version.label")}
              tooltip={t("modal.item.form.version.tooltip")}
            >
              <Input maxLength={16} />
            </Form.Item>
          </div>

          <div id="link">
            <Form.Item
              name={"url"}
              label={t("modal.item.form.link.label")}
              tooltip={t("modal.item.form.link.tooltip")}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Form.Item name={"link"}>
                  <Input allowClear />
                </Form.Item>
                <Button icon={<DownloadOutlined />} onClick={getWebSiteData} />
              </Space.Compact>
            </Form.Item>
            <Form.Item
              name="color1"
              label={t("modal.item.form.color1.label")}
              tooltip={t("modal.item.form.color1.tooltip")}
            >
              <ColorPicker />
            </Form.Item>
            <Form.Item
              name="color2"
              label={t("modal.item.form.color2.label")}
              tooltip={t("modal.item.form.color2.tooltip")}
            >
              <ColorPicker />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={t("modal.item.form.description.label")}
            tooltip={t("modal.item.form.description.tooltip")}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label={t("modal.item.form.image.label")}
            tooltip={t("modal.item.form.image.tooltip")}
          >
            {imageData.data === null || imageData.data === "" ? (
              <Button
                onClick={() =>
                  dispatch(
                    setImageModalItem({
                      name: "item",
                      open: true,
                      type: "image",
                      options: ["base64", "url"],
                    })
                  )
                }
                style={{ width: "100%", height: "100px" }}
              >
                {t("modal.item.form.image.label")}
              </Button>
            ) : (
              <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch(
                    setImageModalItem({
                      name: "item",
                      open: true,
                      type: "image",
                      options: ["base64", "url"],
                      imageInit: imageData,
                    })
                  )
                }
              >
                <Image preview={false} image={imageData} />
              </div>
            )}
          </Form.Item>
          <div id="footer">
            <Form.Item
              name="tags"
              label={t("modal.item.form.tags.label")}
              tooltip={t("modal.item.form.tags.tooltip")}
            >
              <Select
                mode="tags"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <Form.Item
              name="date"
              label={t("modal.item.form.date.label")}
              tooltip={t("modal.item.form.date.tooltip")}
            >
              <DatePicker placeholder={""} style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </Form>

        {/* <ImageModalItem
          name="item"
          setImage={{ avatar: setAvatarData, image: setImageData }}
        /> */}
        <ImageModal
          setImageModal={setImageModalItem}
          imageModal={imageModalItem}
          name="item"
          setImage={{ avatar: setAvatarData, image: setImageData }}
        />
      </Modal>
    </>
  );
}
