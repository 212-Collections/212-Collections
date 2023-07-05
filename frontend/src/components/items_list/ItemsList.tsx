import ItemCard from "../item/item_card/ItemCard";
import Article from "../item/item_article/ItemArticle";
import { CollectionType, ItemType } from "../../types/types";
import ItemVoid from "../item/item_void/ItemVoid";

export default function ItemsList({
  collection,
}: {
  collection: CollectionType;
}) {

  if (!collection) return null;

  return (
    <ul className={collection.view === "antd-card" ? "flex" : ""}>
      {collection.items.map((item: ItemType) => (
        <li key={item._id}>
          {collection.view === "antd-card" ? (
            <ItemCard item={item} collectionId={collection._id} />
          ) : null}
          {collection.view === "article" ? (
            <Article item={item} collectionId={collection._id} />
          ) : null}
        </li>
      ))}
      {Array.from({ length: 10 }, (_, index) => index).map((index) => (
        <li key={index}>
          <ItemVoid size={300} />
        </li>
      ))}
    </ul>
  );
}
