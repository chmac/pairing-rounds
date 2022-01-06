import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chunk, shuffle } from "lodash/fp";
import { nanoid } from "nanoid/non-secure";
import { RootState } from "../../app/store";
import { selectActiveParticipantIds } from "../participants/participantSlice";

export const REDUCER_KEY = "groups" as const;

const PAIR_DELIMITER = "-";
// const ITERATE_LIMIT = 1e5;
const ITERATE_LIMIT = 1e3;

export type Round = string[][];
export interface GroupState {
  rounds: Round[];
  groupSize: number;
}

const initialState: GroupState = {
  rounds: [],
  groupSize: 2,
};

export const groupsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(calculateNextRound.fulfilled, (state, action) => {
      state.rounds.push(action.payload);
    });
  },
});

// const { _setNextRound } = groupsSlice.actions;

type Pairs = { [pairIds: string]: true };
export const selectPairs = (state: RootState) => {
  const { rounds } = state[REDUCER_KEY];
  const pairs = rounds.reduce((pairs, round) => {
    const roundPairs = getPairsFromRound(round);
    return { ...pairs, ...roundPairs };
  }, {});
  return pairs as Pairs;
};

export const selectRounds = (state: RootState) => state[REDUCER_KEY].rounds;

const doesRoundValidate = (pairs: Pairs, round: Round) => {
  const roundPairs = getPairsFromRound(round);
  for (const pairIds in roundPairs) {
    if (pairs[pairIds] === true) {
      return false;
    }
  }
  return true;
};

const getPairsFromRound = (round: Round): Pairs => {
  return round.reduce((acc, group) => {
    return group.reduce((acc, id1) => {
      return group.reduce((acc, id2) => {
        if (id1 !== id2) {
          const pairIds = [id1, id2].sort().join(PAIR_DELIMITER);
          return { ...acc, [pairIds]: true };
        }
        return acc;
      }, acc);
    }, acc);
  }, {});
};

const createRound = (ids: string[], groupSize: number): Round => {
  const shuffled = shuffle(ids);
  const groups = chunk(groupSize, shuffled);
  return groups;
};

const nonBlockingNothing = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

export const calculateNextRound = createAsyncThunk<
  Round,
  void,
  {
    state: RootState;
  }
>("groups/nextRound", async (_, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const ids = selectActiveParticipantIds(state);
  const pairs = selectPairs(state);

  const iterateArray = Array.from({ length: ITERATE_LIMIT });
  const timerId = nanoid();
  console.log("Starting iteration #MLCSyV");
  console.time(timerId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const a of iterateArray) {
    const nextRoundCandidate = createRound(ids, state[REDUCER_KEY].groupSize);
    if (!doesRoundValidate(pairs, nextRoundCandidate)) {
      await nonBlockingNothing();
      continue;
    }
    console.timeEnd(timerId);
    return nextRoundCandidate;
  }
  console.timeEnd(timerId);

  return rejectWithValue(
    `Failed to find round after ${ITERATE_LIMIT} tries. #80fpQN`
  );
});

export default groupsSlice.reducer;
