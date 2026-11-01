import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Question } from "@/components/questions";

import { RESET_STATE } from "../actionTypes";

export interface PhaseData {
  phaseid: string;
  phasename: string;
  phaselabel: string;
  phaseorder: number;
  startdate: string;
  enddate: string;
  sectionsenabled: boolean;
  finished_evaluation: string | null;
}

export interface SectionData {
  sectionid: string;
  sectionname: string;
  sectiondescription: string;
  sectionorder: number;
  phaseid: string;
}

export interface PhasesDataQuestions {
  data: PhaseData;
  questions: Question[] | null;
}

export interface PhasesState {
  phases: {
    [phasename: string]: PhasesDataQuestions;
  };
}

const initialState: PhasesState = {
  phases: {},
};

export const phaseSlice = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setPhase: (
      state,
      action: PayloadAction<{
        phasename: string;
        phasedata: PhaseData;
        phasequestions: Question[];
      }>,
    ) => {
      const { phasename, phasedata, phasequestions } = action.payload;
      state.phases[phasename] = { data: phasedata, questions: phasequestions };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_STATE, () => initialState);
  },
});

export const { setPhase } = phaseSlice.actions;
export default phaseSlice.reducer;
