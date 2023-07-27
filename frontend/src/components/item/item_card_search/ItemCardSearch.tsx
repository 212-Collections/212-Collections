import { Button, Card, Checkbox, Divider, Tag, Typography } from "antd";
import Image from "../../media/image/Image";
import ReactMarkdown from "react-markdown";
import { ElementType, ReactNode } from "react";
import { useAppDispatch } from "../../../redux/store";
import { setItemModal } from "../../../redux/reducers/modal";
import { ItemType } from "../../../types/types";
import Title from "../components/Title";
import { setPage } from "../../../redux/reducers/settings";
import { useTranslation } from "react-i18next";

export default function ItemCardSearch({
  item,
  collectionId,
}: {
  item: ItemType;
  collectionId: any;
}) {
  const { icon, title, description, date, image, version, link, tags, _id } =
    item;
    const { t } = useTranslation();

  const dispatch = useAppDispatch();

  function setCollectionPage(collectionId: string) {
    dispatch(setPage("collection-" + collectionId));
  }

  return (
    <Card
      style={{
        width: 300,
      }}
      cover={image ? <Image preview={false} image={image} /> : null}
      bordered={false}
    >
      <Card.Meta
        title={<Title title={title} version={version} image={icon} />}
      />
      {description && description !== "" ? (
        <Typography.Paragraph ellipsis={{ rows: 4 }}>
          <Divider />
          {description}
        </Typography.Paragraph>
      ) : null}
      {(link && link !== "") || (tags && tags.length > 0) || date ? (
        <Divider />
      ) : null}
      {link && link !== "" ? (
        <Typography.Link ellipsis={true} copyable href={link} target="_blank">
          {link}
        </Typography.Link>
      ) : null}
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          {tags
            ? tags.map((tag, index) => (
                <Tag bordered={false} key={index}>
                  {tag.toLowerCase()}
                </Tag>
              ))
            : null}
        </div>
        <div>{date}</div>
      </div>
      <Button
        style={{ marginTop: "16px" }}
        onClick={() => setCollectionPage(item.collectionId as string)}
      >
        {t("page.search.open")}
      </Button>
    </Card>
  );
}
