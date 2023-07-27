import { useEffect } from "react";
import { Divider, Layout, theme } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import ItemModal from "../../components/modal/item_modal/ItemModal";
import { fetchCollection } from "../../redux/reducers/collection";
import ItemsList from "../../components/items_list/ItemsList";
import Header from "../../components/header/Header";

export default function CollectionPage({
  collectionId,
}: {
  collectionId: string;
}) {
  const dispatch = useAppDispatch();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { collection } = useAppSelector((state) => state.collection);


  useEffect(() => {
    dispatch(fetchCollection(collectionId));
  }, [collectionId, dispatch]);

  if (!collection) return null;

  return (
    <>
      <Header collection={collection} collectionId={collectionId} />
      <Divider
        style={{
          marginTop: "0",
          marginBottom: 0,
          backgroundColor: colorBgContainer,
        }}
      />
      <Layout.Content style={{ overflowY: "auto" }}>
        <ItemsList collection={collection} />
      </Layout.Content>
      <ItemModal collectionId={collectionId} />
    </>
  );
}
