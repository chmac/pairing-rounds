import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chunk, shuffle } from "lodash/fp";
import { RootState } from "../../app/store";
import { selectActiveParticipantIds } from "../participants/participantSlice";

export const REDUCER_KEY = "groups" as const;

const PAIR_DELIMITER = "-";
const ITERATE_LIMIT = 1e5;

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
  reducers: {
    _setNextRound: (state, action: PayloadAction<Round>) => {
      state.rounds.push(action.payload);
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(calculateNextRound, (state) => {
  //     return state;
  //   });
  // },
});

const { _setNextRound: setNextRound } = groupsSlice.actions;

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
  void,
  void,
  {
    state: RootState;
  }
>("groups/nextRound", async (_, { dispatch, getState }) => {
  const state = getState();
  const ids = selectActiveParticipantIds(state);
  const pairs = selectPairs(state);

  const iterateArray = Array.from({ length: ITERATE_LIMIT });
  for (const a of iterateArray) {
    const nextRoundCandidate = createRound(ids, state[REDUCER_KEY].groupSize);
    if (!doesRoundValidate(pairs, nextRoundCandidate)) {
      await nonBlockingNothing();
      continue;
    }
    await dispatch(setNextRound(nextRoundCandidate));
    return;
  }
});

export default groupsSlice.reducer;
