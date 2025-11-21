import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import Template from "../dataTypes/Template";

export interface ActiveTemplateState {
    activeTemplateId: string | null;
}

const initialState: ActiveTemplateState = {
    activeTemplateId: null
};

export const activeTemplateSlice = createSlice({
    name: "activeTemplate",
    initialState,
    reducers: {
        setActiveTemplate: (state, action: PayloadAction<string>) => {
            state.activeTemplateId = action.payload;
        },

        resetActiveTemplate: (state) => {
            state.activeTemplateId = initialState.activeTemplateId;
        }
    }
})

export const selectActiveTemplateName = (state:RootState) => state.activeTemplate.activeTemplateId;

export const { setActiveTemplate, resetActiveTemplate } = activeTemplateSlice.actions;
export default activeTemplateSlice.reducer;