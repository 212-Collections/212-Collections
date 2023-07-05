import { Image as ImageAntd } from "antd";
import { ImageType } from "../../../types/types";

interface PropsType {
  image?: ImageType;
  size?: number | string;
  sizeType?: "width" | "height";
  preview?: boolean;
}

export default function Image({
  image,
  preview = true,
  size,
  sizeType = "width",
}: PropsType) {
  if (!image || !image.data || image.data === "") return null;
  const { render, data } = image;

  return (
    <ImageAntd
      rootClassName={`image ${render}`}
      width={sizeType === "width" ? (size ? size : "100%") : "auto"}
      height={sizeType === "height" ? (size ? size : "100%") : "auto"}
      src={data}
      preview={preview}
      fallback="https://cdn.discordapp.com/attachments/822787638615474176/1118531356289404938/no-image.svg"
      alt="avatar"
    />
  );
}
