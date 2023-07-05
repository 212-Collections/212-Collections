import { Typography, theme } from "antd";
import { setPage } from "../../../redux/reducers/aside";
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import { CollectionType } from "../../../types/types";
import Avatar from "../../media/avatar/Avatar";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function CollectionItem({
  collection,
}: {
  collection: CollectionType;
}) {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.aside.page);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: collection._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function setCollectionPage(collectionId: string) {
    dispatch(setPage("collection-" + collectionId));
  }

  const items = [
    {
      label: "Edit",
      key: "1",
    },
  ];

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={collection._id}
    >
      <div
        onClick={() => setCollectionPage(collection._id)}
        className={
          collection._id === currentPage.split("-")[1] ? "item active" : "item"
        }
      >
        <Avatar
          image={
            collection.icon || {
              type: "color",
              border: "rounded",
              render: "smooth",
              data: "#474b53",
            }
          }
        />
        <Typography.Paragraph ellipsis={{ rows: 2 }}>
          {collection.name}
        </Typography.Paragraph>
      </div>
    </li>
  );
}
