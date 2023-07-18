import {
  Button,
  ColorPicker,
  Divider,
  Form,
  Input,
  Modal,
  Segmented,
  Select,
  Space,
} from "antd";
import { AvatarType, ImageType, UploadType } from "../../../types/types";
import { useEffect, useState } from "react";
import {
  CloudDownloadOutlined,
  LoadingOutlined,
  PictureOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { ImageModalType } from "../../../redux/reducers/modal";
import EmojiSelector from "../components/emoji_selector/EmojiSelector";
import UploadButton from "../components/upload_button/UploadButton";
import twemoji from "twemoji";
import Avatar from "../../media/avatar/Avatar";
import Image from "../../media/image/Image";

const initImageData: ImageType | AvatarType = {
  border: "rounded",
  render: "smooth",
  type: "base64",
  data: "",
};

interface ModalDataType {
  base64: string;
  url: string;
  color: string;
  emoji: string;
  type: UploadType;
}

const initModalData: ModalDataType = {
  base64: "",
  url: "",
  color: "",
  emoji: "",
  type: "base64",
};

export default function ImageModal({
  setImageModal,
  imageModal,
  setImage,
  name,
}: {
  setImageModal: any;
  imageModal: ImageModalType;
  setImage: any;
  name: string;
}) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [modalData, setModalData] = useState<ModalDataType>(initModalData);
  const [imageData, setImageData] = useState<ImageType | AvatarType>(
    initImageData as ImageType | AvatarType
  );

  const [pickerVisible, setPickerVisible] = useState(false);

  const imageModalItem = useAppSelector((state) => state.modal.imageModalItem);

  useEffect(() => {
    if (imageModal.open) {
      if (!imageModal.imageInit) {
        resetForm();
      } else {
        updateModalData();
      }
    }
  }, [imageModal]);

  useEffect(() => {
    updateImageData();
  }, [modalData]);

  function updateModalData() {
    const init = imageModal.imageInit as ImageType | AvatarType | null;
    if (init?.type) {
      const { type, data } = init;
      setModalData({
        url: type === "url" ? data : "",
        base64: type === "base64" ? data : "",
        emoji: type === "emoji" ? data : "",
        color: type === "color" ? data : "",
        type: type,
      });
      if ("border" in init) {
        form.setFieldValue("border", init.border);
      }
      form.setFieldValue("render", init.render);
      if (modalData.url) form.setFieldValue("link", modalData.url);
      if (modalData.color) form.setFieldValue("color", modalData.color);
    }
  }

  function updateImageData() {
    setImageData((currentImageData: any) => {
      const type = modalData.type;
      const data = modalData[type as UploadType];
      const render = imageModal.imageInit?.render || "smooth";
      const border =
        imageModal.imageInit && "border" in imageModal.imageInit
          ? imageModal.imageInit.border
          : "rounded";
      return {
        ...currentImageData,
        type,
        data,
        render,
        border,
      };
    });
  }

  function selectEmoji(selectedEmoji: any) {
    const emoji = selectedEmoji.native;
    const svg = twemoji.parse(emoji, {
      folder: "svg",
      ext: ".svg",
    });
    const svgURL = svg.match(/src="([^"]+)"/)[1];
    setModalData((prevModalData) => ({
      ...prevModalData,
      emoji: svgURL,
    }));
    setPickerVisible(false);
  }

  function setType(value: UploadType) {
    setModalData((prevData) => {
      return {
        ...prevData,
        type: value,
      };
    });
  }

  function submitForm() {
    const { type } = imageModal;
    setImage[type](imageData);
    dispatch(setImageModal({ open: false, imageInit: undefined }));
    resetForm();
  }

  function cancelModal() {
    dispatch(setImageModal({ open: false }));
    resetForm();
  }

  function resetForm() {
    form.resetFields();
    setPickerVisible(false);
    setImageData(initImageData as ImageType | AvatarType);
    setModalData({
      url: "",
      base64: "",
      emoji: "",
      color: "",
      type: "base64",
    });
  }

  const modalTitle = (
    <>
      <PictureOutlined style={{ margin: "0 8px 0 4px" }} />
      Edit {imageModal.type}
    </>
  );

  const segmentedOption = imageModal.options.map((item) => {
    switch (item) {
      case "base64":
        return {
          value: item,
          label: "Upload",
          icon: <PictureOutlined />,
        };
      case "url":
        return {
          value: item,
          label: "From URL",
          icon: <CloudDownloadOutlined />,
        };
      case "emoji":
        return {
          value: item,
          label: "Emoji",
          icon: <SmileOutlined />,
        };
      case "color":
        return {
          value: item,
          label: "Color",
          icon: (
            <span className="anticon" role="img">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z"
                  strokeWidth="0"
                  fill="currentColor"
                />
              </svg>
            </span>
          ),
        };
      default:
        return {
          value: item,
          label: item,
        };
    }
  });

  const modalFooter = [
    <Button key="reset" danger onClick={resetForm}>
      Reset
    </Button>,
    <Button key="cancel" onClick={cancelModal}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => form.submit()}
      icon={imageModal.loading ? <LoadingOutlined /> : null}
    >
      Create
    </Button>,
  ];

  const smoothSVG = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21a9.01 9.01 0 0 0 2.32 -.302a9 9 0 0 0 1.74 -16.733a9 9 0 1 0 -4.06 17.035z" />
        <path d="M12 3v17" />
        <path d="M12 12h9" />
        <path d="M12 9h8" />
        <path d="M12 6h6" />
        <path d="M12 18h6" />
        <path d="M12 15h8" />
      </svg>
    </span>
  );

  const pixelatedSVG = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
        <path d="M10 4l4 16" />
        <path d="M12 12l-8 2" />
      </svg>
    </span>
  );

  const roundedSVG = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      </svg>
    </span>
  );

  const roundSVG = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      </svg>
    </span>
  );

  const squareSVG = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M3 3h18v18H3z" />
      </svg>
    </span>
  );

  return (
    <Modal
      title={modalTitle}
      open={imageModal.open}
      onCancel={cancelModal}
      footer={modalFooter}
    >
      {imageModal.open ? (
        <>
          <Segmented
            onChange={(value) => setType(value as UploadType)}
            options={segmentedOption}
            value={imageData.type || "base64"}
            style={{ marginBottom: "16px" }}
          />
          <Form
            form={form}
            layout="vertical"
            name={"image_modal_" + name}
            onFinish={submitForm}
          >
            {imageModal.options.map((option: any, index: number) => {
              if (option === "base64" && imageData.type === "base64") {
                return (
                  <Form.Item
                    key={index}
                    style={{ marginBottom: "0" }}
                    name="image"
                  >
                    <UploadButton
                      setImageBase32={(value) =>
                        setModalData((data) => ({ ...data, base64: value }))
                      }
                      uploadType="icon"
                      crop={
                        imageModal.type === "avatar"
                          ? {
                              showReset: true,
                              rotationSlider: true,
                              fillColor: "transparent",
                              maxZoom: 20,
                            }
                          : null
                      }
                    />
                  </Form.Item>
                );
              }

              if (option === "url" && imageData.type === "url") {
                return (
                  <Form.Item
                    style={{ marginBottom: "0", width: "100%" }}
                    name="link"
                    key={index}
                  >
                    <Input
                      placeholder="URL"
                      allowClear
                      value={modalData.url}
                      onChange={(e) =>
                        setModalData((data) => ({
                          ...data,
                          url: e.target.value.trim(),
                        }))
                      }
                    />
                  </Form.Item>
                );
              }

              if (option === "emoji" && imageData.type === "emoji") {
                return (
                  <Form.Item
                    key={index}
                    style={{ marginBottom: "0", width: "100%" }}
                  >
                    <EmojiSelector
                      selectEmoji={selectEmoji}
                      setVisible={setPickerVisible}
                      visible={pickerVisible}
                    />
                  </Form.Item>
                );
              }

              if (option === "color" && imageData.type === "color") {
                return (
                  <Form.Item
                    key={index}
                    style={{ marginBottom: "0", width: "100%" }}
                    name="color"
                  >
                    <ColorPicker
                      format="hex"
                      placement="bottom"
                      value={modalData.color}
                      defaultValue={modalData.color || "#1668DC"}
                      onChange={(value) =>
                        setModalData((data) => ({
                          ...data,
                          color: value.toHexString(),
                        }))
                      }
                    />
                  </Form.Item>
                );
              }

              return null;
            })}
            <Divider />
            <div
              style={
                imageModal.type === "avatar"
                  ? { display: "flex", gap: "16px" }
                  : {}
              }
            >
              <div style={{ flex: 1 }}>
                <Form.Item
                  name="render"
                  label="Render type"
                  tooltip="The type of render"
                  initialValue="smooth"
                >
                  <Select
                    disabled={
                      imageData.type === "color" || imageData.type === "emoji"
                        ? true
                        : false
                    }
                    style={{ width: "100%" }}
                    value={imageData.render}
                    onChange={(value) =>
                      setImageData((data: AvatarType | ImageType) => {
                        return { ...data, render: value };
                      })
                    }
                  >
                    <Select.Option value="pixelated" label="Pixelated">
                      <Space>
                        {pixelatedSVG}
                        Pixelated
                      </Space>
                    </Select.Option>
                    <Select.Option value="smooth" label="Smooth">
                      <Space>
                        {smoothSVG}
                        Smooth
                      </Space>
                    </Select.Option>
                  </Select>
                </Form.Item>
                {imageModal.type !== "image" ? (
                  <Form.Item
                    name="border"
                    label="Border type"
                    tooltip="The type of border"
                    initialValue="rounded"
                  >
                    <Select
                      disabled={imageData.type === "emoji" ? true : false}
                      style={{ width: "100%" }}
                      value={
                        imageData && "border" in imageData
                          ? imageData.border
                          : "rounded"
                      }
                      onChange={(value) =>
                        setImageData((d: AvatarType | ImageType) => {
                          return { ...d, border: value };
                        })
                      }
                    >
                      <Select.Option value="round" label="Round">
                        <Space>
                          {roundSVG}
                          Round
                        </Space>
                      </Select.Option>
                      <Select.Option value="rounded" label="Rounded">
                        <Space>
                          {roundedSVG}
                          Rounded
                        </Space>
                      </Select.Option>
                      <Select.Option value="square" label="Square">
                        <Space>
                          {squareSVG}
                          Square
                        </Space>
                      </Select.Option>
                    </Select>
                  </Form.Item>
                ) : null}
              </div>
              <div style={{ flex: 1 }}>
                {imageModal.type === "avatar" ? (
                  <Avatar image={imageData as AvatarType} />
                ) : null}
                {imageModal.type === "image" ? (
                  <Image image={imageData as ImageType} />
                ) : null}
              </div>
            </div>
          </Form>
        </>
      ) : null}
    </Modal>
  );
}
