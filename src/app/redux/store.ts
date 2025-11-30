import { combineReducers, configureStore, type Action , type ThunkAction } from '@reduxjs/toolkit';
import activeComponentReducer from './activeComponentSlice';
import activeTemplateReducer from './activeTemplateSlice';
import dataRefreshReducer from './dataRefreshSlice';
import contactInfoReducer from './contactInformationSlice';

const rootReducer = combineReducers({
    activeComponent: activeComponentReducer,
    activeTemplate: activeTemplateReducer,
    dataRefresh: dataRefreshReducer,
    contactInfo: contactInfoReducer,
})

export const store = configureStore({
  reducer: rootReducer
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;