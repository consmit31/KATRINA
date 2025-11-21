import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface ActiveComponentState {
    activeComponent: "IssueSelector" | "TemplateForm" | "NoteField";
}

const initialState: ActiveComponentState = {
    activeComponent: "IssueSelector"
};

export const activeComponentSlice = createSlice({
    name: "activeComponent",
    initialState,
    reducers: {
        setActiveComponent: (state, action: PayloadAction<"IssueSelector" | "TemplateForm" | "NoteField">) => {
            state.activeComponent = action.payload;
        },

        resetActiveComponent: (state) => {
            state.activeComponent = initialState.activeComponent;
        }
    }
})

export const selectActiveComponent = (state:RootState) => state.activeComponent.activeComponent;

export const { setActiveComponent, resetActiveComponent } = activeComponentSlice.actions;
export default activeComponentSlice.reducer;