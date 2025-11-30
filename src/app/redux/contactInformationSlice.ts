import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface ContactInfoState {
    name: string;
    userId: string;
    phone: string;
    email: string;
}

const initialState: ContactInfoState = {
    name: "",
    userId: "",
    phone: "",
    email: "",
};

export const contactInfoSlice = createSlice({
    name: "contactInfo",
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setPhone: (state, action) => {
            state.phone = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        clearContactInfo: (state) => {
            state.name = "";
            state.userId = "";
            state.phone = "";
            state.email = "";
        }
    }
});

export const { setName, setUserId, setEmail, setPhone, clearContactInfo } = contactInfoSlice.actions;

export const selectContactName = (state: RootState) => state.contactInfo.name;
export const selectContactUserId = (state: RootState) => state.contactInfo.userId;
export const selectContactPhone = (state: RootState) => state.contactInfo.phone;
export const selectContactEmail = (state: RootState) => state.contactInfo.email;

export default contactInfoSlice.reducer;