import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MessageState = {
  title: string;
  type: "success" | "error" | "info" | "warning";
  description: string
};

interface MessageState_ {
  message: MessageState;
}

const initialState: MessageState_ = {
  message: {
    title: "",
    type: "success",
    description: ""
  },
};

export const MessageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<MessageState>) => {
      state.message = action.payload;
    },
    resetMessageReducer: (state) => {
      state = initialState
    }
  },
});

export default MessageSlice.reducer;
export const { setMessage, resetMessageReducer } = MessageSlice.actions;
