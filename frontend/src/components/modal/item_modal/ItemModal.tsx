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

export default function ItemModal({ collectionId }: { collectionId: string }) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

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
      reset();
    }
  }, [itemModal]);

  function cancel() {
    dispatch(setItemModal({ open: false }));
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
      data: "",
    });
    setAvatarData({
      border: "rounded",
      render: "smooth",
      type: "base64",
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
        form.setFieldsValue({
          title: data.title,
          description: data.description,
        });
        if (data.icon)
          setAvatarData({
            border: "rounded",
            render: "smooth",
            data: data.icon,
            type: "url",
          });
        if (data.image)
          setImageData({
            render: "smooth",
            data: data.image,
            type: "url",
          });
      });
  }

  // function deleteI() {
  //   dispatch(deleteItem({ ...itemModal.data, collection_id: collectionId }));
  // }

  const modalFooter = [
    <Button key="reset" danger onClick={() => form.resetFields()}>
      Reset
    </Button>,
    <Button key="cancel" onClick={cancel}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => form.submit()}
      icon={itemModal.loading ? <LoadingOutlined /> : null}
    >
      {itemModal.type === "update" ? "Update" : "Create"}
    </Button>,
  ];

  return (
    <>
      <Modal
        title={itemModal.type === "new" ? "New Item" : "Edit Item"}
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
                Icon
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
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Title is required",
                },
              ]}
            >
              <Input maxLength={32} allowClear />
            </Form.Item>
            <Form.Item name="version" label="Version">
              <Input maxLength={16} />
            </Form.Item>
          </div>

          <div id="link">
            <Form.Item
              name="link"
              label="Link"
              tooltip="The link of the new item"
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input allowClear />
                <Button icon={<DownloadOutlined />} onClick={getWebSiteData} />
              </Space.Compact>
            </Form.Item>
            <Form.Item name="color1" label=" " tooltip="Color 1">
              <ColorPicker />
            </Form.Item>
            <Form.Item label=" " name="color2" tooltip="Color 2">
              <ColorPicker />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            tooltip="The description of the new item"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Image">
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
                Image
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
            <Form.Item name="tags" label="Tags">
              <Select
                mode="tags"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <Form.Item name="date" label="Date">
              <DatePicker style={{ width: "100%" }} />
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
