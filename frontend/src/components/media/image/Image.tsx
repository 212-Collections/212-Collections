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
  const { render, data, background } = image;

  let backgroundColor = "#" + background;
  if (!background) backgroundColor = "#00000000";

  return (
    <ImageAntd
      rootClassName={`image ${render}`}
      width={sizeType === "width" ? (size ? size : "100%") : "auto"}
      height={sizeType === "height" ? (size ? size : "100%") : "auto"}
      src={data}
      preview={preview}
      fallback="https://raw.githubusercontent.com/212-Collections/Branding/main/resources/no_image.svg"
      alt="avatar"
      style={{
        backgroundColor: backgroundColor,
      }}
    />
  );
}
