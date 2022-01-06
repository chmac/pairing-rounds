import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectParticipants } from "../participants/participantSlice";
import styles from "./Groups.module.css";
import {
  calculateNextRound,
  decrementGroupSize,
  incrementGroupSize,
  selectGroupSize,
  selectIsWorkingOnNextRound,
  selectNextRoundError,
  selectRounds,
} from "./groupsSlice";

export function Groups() {
  const rounds = useAppSelector(selectRounds);
  const groupSize = useAppSelector(selectGroupSize);
  const isWorkingOnNextRound = useAppSelector(selectIsWorkingOnNextRound);
  const nextRoundError = useAppSelector(selectNextRoundError);
  const participants = useAppSelector(selectParticipants);
  const dispatch = useAppDispatch();

  return (
    <div>
      {rounds.map((round, i) => (
        <div className={styles.round} key={i}>
          {round.map((group, i) => (
            <div className={styles.group} key={i}>
              {group.map((id, i) => (
                <span className={styles.participant} key={i}>
                  {participants[id].name}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}

      {!isWorkingOnNextRound ? null : (
        <div className={styles.round}>
          <p>Trying to find a valid next round</p>
        </div>
      )}

      {nextRoundError === "" ? null : (
        <div className={styles.round}>
          <p>Error: {nextRoundError}</p>
        </div>
      )}

      <div className={styles.row}>
        <span>Group size:</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrementGroupSize())}
        >
          -
        </button>
        <span className={styles.groupSize}>{groupSize}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(incrementGroupSize())}
        >
          +
        </button>
        <button
          className={styles.button}
          aria-label="Next round"
          onClick={() => dispatch(calculateNextRound())}
          disabled={isWorkingOnNextRound}
        >
          Calculate next round
        </button>
        <span className={styles.value}>{}</span>
      </div>
    </div>
  );
}
