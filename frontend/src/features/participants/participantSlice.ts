import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customAlphabet } from "nanoid";
import { AppThunk, RootState } from "../../app/store";

const generateId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4);

export const REDUCER_KEY = "participants" as const;

export interface ParticipantData {
  name: string;
  active: boolean;
}
export interface Participants {
  [id: string]: ParticipantData;
}
export interface Participant extends ParticipantData {
  id: string;
}

export interface ParticipantState {
  participants: Participants;
}

const initialState: ParticipantState = {
  participants: {},
};

export const partitipantsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    toggleParticipantIsActive: (state, action: PayloadAction<string>) => {
      const p = state.participants[action.payload];
      if (typeof p === "undefined") {
        throw new Error("Trying to toggle non existent participant. #rjdh7b");
      }
      p.active = !p.active;
    },
    _addParticipant: (state, action: PayloadAction<Participant>) => {
      const { id, ...participant } = action.payload;
      if (typeof state.participants[id] !== "undefined") {
        throw new Error("Cannot add duplicate participant #7VLa8q");
      }
      state.participants[id] = participant;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(calculateNextRound, (state) => {
  //     return state;
  //   });
  // },
});

const { _addParticipant } = partitipantsSlice.actions;
export const { toggleParticipantIsActive } = partitipantsSlice.actions;

export const selectParticipants = (state: RootState) =>
  state[REDUCER_KEY].participants;
export const selectParticipantsArray = (state: RootState) => {
  const participants = selectParticipants(state);
  const output = Object.keys(participants).map((key) => {
    return { ...participants[key], id: key };
  });
  return output;
};

export const selectParticipantIds = (state: RootState) =>
  Object.keys(selectParticipants(state));
export const selectActiveParticipantIds = (state: RootState) => {
  const participants = selectParticipants(state);
  const allIds = selectParticipantIds(state);
  const ids = allIds.filter((id) => participants[id].active);
  return ids;
};

export const addParticipant =
  (name: string): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const ids = selectParticipantIds(state);
    for (const a in Array.from({ length: 5 })) {
      const id = generateId();
      if (ids.indexOf(id) !== -1) {
        continue;
      }
      const participant = { id, name, active: true };
      dispatch(_addParticipant(participant));
      return;
    }
    throw new Error("Failed to generate valid ID after 5 attempts. #60x5fc");
  };

export default partitipantsSlice.reducer;
