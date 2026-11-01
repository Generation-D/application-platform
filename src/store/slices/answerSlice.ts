import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RESET_STATE } from "../actionTypes";

export const INIT_PLACEHOLDER = "__INITIAL_PLACEHOLDER__";

type AnswerValue = string | number | boolean | null;

export type AnswerState = {
  [questionid: string]: {
    answervalue: AnswerValue;
    answerid: string;
  };
};

const initialState: AnswerState = {};

const answerSlice = createSlice({
  name: "answer",
  initialState: initialState,
  reducers: {
    UpdateAnswer: (
      state,
      action: PayloadAction<{
        questionid: string;
        answervalue: AnswerValue;
        answerid: string;
      }>,
    ) => {
      const { questionid, answervalue, answerid } = action.payload;
      if (answervalue === INIT_PLACEHOLDER) {
        state[questionid] = { answervalue: null, answerid };
      } else if (
        answervalue === "" ||
        answervalue === false ||
        answervalue === null
      ) {
        if (state[questionid]) {
          delete state[questionid];
        }
      } else {
        state[questionid] = { answervalue, answerid };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_STATE, () => initialState);
  },
});

export const { UpdateAnswer } = answerSlice.actions;
export default answerSlice.reducer;
