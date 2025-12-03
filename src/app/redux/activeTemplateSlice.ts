import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import TemplateField from "@dataTypes/TemplateField";

export interface ActiveTemplateState {
    activeTemplateId: string | null;
    templateFields?: TemplateField[];
}

const initialState: ActiveTemplateState = {
    activeTemplateId: null,
    templateFields: []
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
            state.templateFields = initialState.templateFields;
        }, 

        setTemplateFields: (state, action: PayloadAction<TemplateField[]>) => {
            state.templateFields = action.payload;
        },

        updateFieldValue: (state, action: PayloadAction<{label:string, value:string}>) => {
            if (!state.templateFields) return;

            const { label, value } = action.payload;

            state.templateFields = state.templateFields.map(field => {
                if (field.label === label) {
                    return { ...field, value };
                }
                return field;
            });
        }   
    }
})

export const selectActiveTemplateName = (state:RootState) => state.activeTemplate.activeTemplateId;
export const selectTemplateFields = (state:RootState) => state.activeTemplate.templateFields;

export const { setActiveTemplate, resetActiveTemplate, setTemplateFields, updateFieldValue } = activeTemplateSlice.actions;
export default activeTemplateSlice.reducer;