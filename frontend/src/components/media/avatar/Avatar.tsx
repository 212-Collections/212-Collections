import { Image } from "antd";
import { AvatarType } from "../../../types/types";

export default function Avatar({
  image,
  size,
}: {
  image: AvatarType;
  size?: number | string;
}) {
  if (!image || !image.data || image.data === "") return <></>;
  const img = (
    <Image
      preview={false}
      src={image.data}
      fallback="https://raw.githubusercontent.com/212-Collections/Branding/main/resources/no_image.svg"
      alt="avatar"
      sizes={size + "px" || "100px"}
    />
  );

  return (
    <div
      className={`avatar ${image.type} ${
        image.type === "base64" || image.type === "url" ? image.render : ""
      } ${
        image.type === "base64" ||
        image.type === "url" ||
        image.type === "color"
          ? image.border
          : ""
      }`}
      style={{ width: size || "100px", height: size || "100px", flexShrink: 0 }}
    >
      {image.type === "base64" ? img : null}
      {image.type === "url" ? img : null}
      {image.type === "emoji" ? img : null}
      {image.type === "color" ? (
        <span style={{ backgroundColor: image.data }}></span>
      ) : null}
    </div>
  );
}
