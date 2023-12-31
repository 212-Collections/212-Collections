export type UploadType = "base64" | "url" | "emoji" | "color";
export type ImageTypeType = "image" | "avatar";

export interface ImageType {
  render: "smooth" | "pixelated";
  data: string;
  background: string;
  type: Exclude<UploadType, "emoji" | "color">;
}

export interface AvatarType {
  border: "square" | "rounded" | "round";
  render: "pixelated" | "smooth";
  type: UploadType;
  background: string;
  data: string;
}

export interface CollectionType {
  _id: string;
  name: string;
  view: string;
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

export interface accountType {
  username: string;
  cluster: string;
  token: string;
  database: string;
}
