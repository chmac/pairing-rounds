import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import groupsReducer, {
  REDUCER_KEY as groupsKey,
} from "../features/groups/groupsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [groupsKey]: groupsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
