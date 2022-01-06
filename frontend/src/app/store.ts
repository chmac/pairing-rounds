import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import groupsReducer, {
  REDUCER_KEY as groupsKey,
} from "../features/groups/groupsSlice";
import participantsReducer, {
  REDUCER_KEY as participantsKey,
} from "../features/participants/participantSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [groupsKey]: groupsReducer,
    [participantsKey]: participantsReducer,
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
