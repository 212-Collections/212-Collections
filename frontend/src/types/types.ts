export type UploadType = "base64" | "url" | "emoji" | "color"
export type ImageTypeType = "image" | "avatar"

export interface ImageType {
  render: "smooth" | "pixelated";
  data: string;
  type: Exclude<UploadType, "emoji" | "color">;
}

export interface AvatarType {
  border: "square" | "rounded" | "round";
  render: "pixelated" | "smooth";
  type: UploadType;
  data: string;
}

export interface CollectionType {
  _id: string;
  name: string;
  view: "antd-card" | "article";
  items: ItemType[];
  icon?: AvatarType;
  position?: number | undefined;
}

export interface ItemType {
  _id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: AvatarType;
  image?: ImageType;
  version?: string;
  link?: string;
  tags?: string[];
  collectionId?: string;
}
