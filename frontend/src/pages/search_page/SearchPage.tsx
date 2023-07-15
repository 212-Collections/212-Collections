import { Divider, Layout, theme, Input, Checkbox } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import { ItemType } from "../../types/types";
import ItemVoid from "../../components/item/item_void/ItemVoid";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import ItemCardSearch from "../../components/item/item_card_search/ItemCardSearch";

export default function SearchPage() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const options = ["title", "version", "link", "description", "tags"];
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(options);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const [result, setResult] = useState([]);
  const dispatch = useAppDispatch();
  const selectedText = useAppSelector((state) => state.aside.selectedText);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.focus();
      if (selectedText) {
        setValue(selectedText);
        onSearch(selectedText);
      }
    }
  }, [selectedText]);

  const onSearch = (e:string) => {
    if (!e || checkedList.length === 0) return;
    setLoading(true);
    fetch("http://localhost:49449/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term: e,
        fields: checkedList.join(","),
      }),
    })
      .then((res) => res.json())
      .then((obj: any) => {
        setLoading(false);
        setResult(obj.results);
      });
  };

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? options : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const itemCards = useMemo(() => {
    return result?.map((item: ItemType) => (
      <li key={item._id}>
        <ItemCardSearch item={item} collectionId={item.collectionId} />
      </li>
    ));
  }, [result]);

  return (
    <>
      <header
        id="header"
        style={{ backgroundColor: colorBgContainer, gap: "32px" }}
      >
        <div style={{ flexGrow: 1 }}>
          <Input.Search
            placeholder="input search text"
            onSearch={onSearch}
            id="search-input"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            loading={loading}
          />
        </div>
        <div>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            Check all
          </Checkbox>
          <Checkbox.Group
            options={options}
            value={checkedList}
            onChange={onChange}
          />
        </div>
      </header>
      <Divider
        style={{
          marginTop: "0",
          marginBottom: 0,
          backgroundColor: colorBgContainer,
        }}
      />
      <Layout.Content style={{ overflowY: "auto" }}>
        <ul className={"flex"}>
          {itemCards}
          {Array.from({ length: 10 }, (_, index) => index).map((index) => (
            <li key={index}>
              <ItemVoid size={300} />
            </li>
          ))}
        </ul>
      </Layout.Content>
    </>
  );
}
