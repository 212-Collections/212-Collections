import { Form, Select, Space } from "antd";
import {
  ThemeState,
  saveSettings,
  setDefaultTheme,
  setLang,
} from "../../redux/reducers/settings";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function Settings() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const defaultTheme = useAppSelector((state) => state.settings.defaultTheme);
  const defaultItemView = useAppSelector(
    (state) => state.settings.defaultItemView
  );
  const lang = useAppSelector((state) => state.settings.lang);

  useEffect(() => {
    form.setFieldsValue({
      defaultItemView: defaultItemView,
      defaultTheme: defaultTheme,
      lang: lang,
    });
  }, [defaultItemView, defaultTheme, lang]);

  function submit(value: any) {
    dispatch(saveSettings(value));
  }

  function handleLanguageChange(lang: string) {
    dispatch(setLang(lang));
    handleChange();
  }

  function handleThemeChange(theme: ThemeState) {
    dispatch(setDefaultTheme(theme));
    handleChange();
  }

  function handleChange() {
    form.submit();
  }

  const LightIcon = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="grid"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path
          d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"
          strokeWidth="0"
          fill="currentColor"
        />
      </svg>
    </span>
  );

  const darkIcon = (
    <span className="anticon" role="img">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="grid"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z"
          strokeWidth="0"
          fill="currentColor"
        />
      </svg>
    </span>
  );

  return (
    <Form form={form} layout="vertical" name={"settings"} onFinish={submit}>
      <div style={{ display: "inline-block" }}>
        <Form.Item
          name="defaultTheme"
          label={t("page.home.tabs.settings.theme.title")}
        >
          <Select onChange={handleThemeChange}>
            <Select.Option value="dark" label="Dark">
              <Space>
                {darkIcon}
                {t("page.home.tabs.settings.theme.dark")}
              </Space>
            </Select.Option>
            <Select.Option value="light" label="Light">
              <Space>
                {LightIcon}
                {t("page.home.tabs.settings.theme.light")}
              </Space>
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="defaultItemView"
          label={t("page.home.tabs.settings.view.title")}
        >
          <Select onChange={handleChange}>
            <Select.Option value="card" label={t("page.home.tabs.settings.view.card")}>
              <Space>{t("page.home.tabs.settings.view.card")}</Space>
            </Select.Option>
            <Select.Option value="article" label={t("page.home.tabs.settings.view.article")}>
              <Space>{t("page.home.tabs.settings.view.article")}</Space>
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="lang"
          label={t("page.home.tabs.settings.language.title")}
        >
          <Select onChange={handleLanguageChange}>
            <Select.Option value="en" label="English">
              <Space>English</Space>
            </Select.Option>
            <Select.Option value="fr" label="Français">
              <Space>Français</Space>
            </Select.Option>
            <Select.Option value="rune" label="Rune">
              <Space>ᚱᚢᚾᛖ</Space>
            </Select.Option>
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
}
