import { useEffect } from "react";
import { Button } from "antd";
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import { setCollectionModal } from "../../../redux/reducers/modal";
import {
  fetchList,
  setCollectionList,
  sortCollection,
} from "../../../redux/reducers/list";
import { PlusOutlined } from "@ant-design/icons";
import CollectionItem from "../collection_item/CollectionItem";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CollectionType } from "../../../types/types";

export default function CollectionsList() {
  const dispatch = useAppDispatch();
  const { collections } = useAppSelector((state) => state.list);

  // useEffect(() => {
  //   console.log(collections);
  // }, [collections]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        await dispatch(fetchList());
      } catch (error) {
        console.log(error);
      }
    };

    fetchCollections();
  }, [dispatch]);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || !active) return;
    if (active.id !== over.id) {
      const activeIndex = collections.findIndex((c) => c._id === active.id);
      const overIndex = collections.findIndex((c) => c._id === over.id);
      const newCollectionsList = arrayMove(collections, activeIndex, overIndex);
      console.log("NEW SORT");
      dispatch(
        sortCollection({ activeIndex: activeIndex, overIndex: overIndex })
      );
      dispatch(setCollectionList(newCollectionsList));
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!(collections.length >= 1)) return null;
  
  

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <ul id="collections_list">
        <SortableContext
          items={collections.map((c) => c._id)}
          strategy={verticalListSortingStrategy}
        >
          {collections.map((collection) => (
            <CollectionItem key={collection._id} collection={collection} />
          ))}
        </SortableContext>
      </ul>
    </DndContext>
  );
}
