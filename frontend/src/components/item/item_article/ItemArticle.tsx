import { Card, Checkbox, Divider, Tag, Typography } from "antd";
import Image from "../../media/image/Image";
import ReactMarkdown from "react-markdown";
import { ElementType, ReactNode } from "react";
import { setItemModal } from "../../../redux/reducers/modal";
import { useAppDispatch } from "../../../redux/store";
import { ItemType } from "../../../types/types";
import Title from "../components/Title";
import { deleteItem } from "../../../redux/reducers/collection";

export default function ItemArticle({
  item,
  collectionId,
}: {
  item: ItemType;
  collectionId: any;
}) {
  const { icon, title, description, date, image, version, link, tags } = item;

  const renderers: { [nodeType: string]: ElementType } = {
    h1: ({ node, ...props }: { node: ReactNode }) => {
      return (
        <>
          <Typography.Title level={1} {...props} />
        </>
      );
    },
    h2: ({ node, ...props }: { node: React.ReactNode }) => {
      return (
        <>
          <Typography.Title level={2} {...props} />
        </>
      );
    },
    h3: ({ node, ...props }: { node: React.ReactNode }) => {
      return (
        <>
          <Typography.Title level={3} {...props} />
        </>
      );
    },
    h4: ({ node, ...props }: { node: React.ReactNode }) => {
      return (
        <>
          <Typography.Title level={4} {...props} />
        </>
      );
    },
    h5: ({ node, ...props }: { node: React.ReactNode }) => {
      return (
        <>
          <Typography.Title level={5} {...props} />
        </>
      );
    },
    h6: ({ node, ...props }: { node: React.ReactNode }) => {
      return (
        <>
          <Typography.Text strong {...props} />
        </>
      );
    },
    p: ({ node, ...props }: { node: React.ReactNode }) => {
      return <Typography.Paragraph {...props} />;
    },
    input: ({ node, ...props }: { node: React.ReactNode }) => {
      return <Checkbox {...props} />;
    },
    ol: ({ node, ...props }: { node: React.ReactNode }) => {
      return (
        <Typography.Text>
          <ol {...props} />
        </Typography.Text>
      );
    },
    ul: ({ node, ...props }: { node: React.ReactNode }) => {
      return (
        <Typography.Paragraph>
          <ul {...props} />
        </Typography.Paragraph>
      );
    },
    hr: ({ node, ...props }: { node: React.ReactNode }) => {
      return <Divider {...props} />;
    },
  };

  const dispatch = useAppDispatch();

  function editItem() {
    dispatch(setItemModal({ type: "update", open: true, data: item }));
  }

  function deleteItemFunction() {
    dispatch(deleteItem({ ...item, collectionId: collectionId }));
  }

  return (
    <>
      <Card
        bordered={false}
        style={{ marginBottom: "32px" }}
        title={
          <Title
            title={title}
            version={version}
            editFunction={editItem}
            deleteFunction={deleteItemFunction}
            image={icon}
          />
        }
      >
        {image?.data && image.data !== "" ? (
          <div style={{ marginBottom: "16px" }}>
            {image ? (
              <Image
                preview={false}
                size={150}
                sizeType="height"
                image={image}
              />
            ) : null}
          </div>
        ) : null}
        {description && description !== "" ? (
          <Typography.Paragraph>
            <ReactMarkdown components={renderers}>{description}</ReactMarkdown>
          </Typography.Paragraph>
        ) : null}
        {(link && link !== "") || (tags && tags.length > 0) || date ? (
          <Divider />
        ) : null}
        {link && link !== "" ? (
          <>
            <Typography.Link
              ellipsis={true}
              copyable
              href={link}
              target="_blank"
            >
              {link}
            </Typography.Link>
          </>
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
      </Card>
    </>
  );
}
