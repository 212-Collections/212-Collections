import { Button, Popover } from "antd";
import data from "@emoji-mart/data/sets/14/twitter.json";
import ImgCrop from "antd-img-crop";
import Picker from "@emoji-mart/react";
import { current } from "@reduxjs/toolkit";
import { useAppSelector } from "../../../../redux/store";

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
  
  const currentTheme = useAppSelector((state) => state.aside.theme);

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
        Choose Emoji
      </Button>
    </Popover>
  );
}
