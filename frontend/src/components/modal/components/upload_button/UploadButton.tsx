import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload/interface";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

interface UploadButtonProps {
  setImageBase32: (arg: any) => any;
  uploadType: "icon" | "image";
  crop?: any;
}
export default function UploadButton({
  setImageBase32,
  uploadType,
  crop,
}: UploadButtonProps) {
  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImageBase32(url);
      });
    }
  };

  const upload = (
    <Upload
      multiple={false}
      maxCount={1}
      name="avatarUpload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
      action={`http://localhost:49449/upload/${uploadType}`}
      onRemove={() => setImageBase32("")}
    >
      <Button type="primary" icon={<UploadOutlined />}>
        Click to Upload
      </Button>
    </Upload>
  );

  return <>{crop ? <ImgCrop {...crop}>{upload}</ImgCrop> : <>{upload}</>}</>;
}
