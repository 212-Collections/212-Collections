import ItemCard from "../item/item_card/ItemCard";
import Article from "../item/item_article/ItemArticle";
import { CollectionType, ItemType } from "../../types/types";
import ItemVoid from "../item/item_void/ItemVoid";
import { useAppSelector } from "../../redux/store";

export default function ItemsList({
  collection,
}: {
  collection: CollectionType;
}) {
  const defaultItemView = useAppSelector(
    (state) => state.settings.defaultItemView
  );
  if (!collection) return null;

  const view =
    collection.view === "default" ? defaultItemView : collection.view;

  return (
    <ul className={view === "card" ? "flex" : ""}>
      {collection.items.map((item: ItemType) => (
        <li key={item._id}>
          {view === "card" ? (
            <ItemCard item={item} collectionId={collection._id} />
          ) : null}
          {view === "article" ? (
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
