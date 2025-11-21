import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface DataRefreshState {
    issueRefreshTrigger: number;
    templateRefreshTrigger: number;
}

const initialState: DataRefreshState = {
    issueRefreshTrigger: 0,
    templateRefreshTrigger: 0
};

export const dataRefreshSlice = createSlice({
    name: "dataRefresh",
    initialState,
    reducers: {
        triggerIssueRefresh: (state) => {
            state.issueRefreshTrigger += 1;
        },
        triggerTemplateRefresh: (state) => {
            state.templateRefreshTrigger += 1;
        },
        triggerAllRefresh: (state) => {
            state.issueRefreshTrigger += 1;
            state.templateRefreshTrigger += 1;
        }
    }
});

export const selectIssueRefreshTrigger = (state: RootState) => state.dataRefresh.issueRefreshTrigger;
export const selectTemplateRefreshTrigger = (state: RootState) => state.dataRefresh.templateRefreshTrigger;

export const { triggerIssueRefresh, triggerTemplateRefresh, triggerAllRefresh } = dataRefreshSlice.actions;
export default dataRefreshSlice.reducer;