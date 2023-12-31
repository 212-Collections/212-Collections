import { Button, Popover } from "antd";
import data from "@emoji-mart/data/sets/14/twitter.json";
import Picker from "@emoji-mart/react";
import { useAppSelector } from "../../../../redux/store";
import { useTranslation } from "react-i18next";

interface EmojiSelectorProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  selectEmoji: (emoji: any) => void;
}

export default function EmojiSelector({
  visible,
  setVisible,
  selectEmoji,
}: EmojiSelectorProps) {
  const currentTheme = useAppSelector((state) => state.settings.currentTheme);
  const { t } = useTranslation();

  return (
    <Popover
      trigger="click"
      open={visible}
      onOpenChange={() => setVisible(!visible)}
      content={
        <div id="emoji_picker">
          <Picker
            data={data}
            autoFocus={true}
            navPosition="bottom"
            skinTonePosition="search"
            onEmojiSelect={selectEmoji}
            set="twitter"
            theme={currentTheme}
          />
        </div>
      }
    >
      <Button style={{ display: "block" }} type="primary">
        {t("modal.image.menu.emoji.submit")}
      </Button>
    </Popover>
  );
}
