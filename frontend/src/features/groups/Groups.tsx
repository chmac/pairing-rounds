import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectParticipants } from "../participants/participantSlice";
import styles from "./Groups.module.css";
import { calculateNextRound, selectRounds } from "./groupsSlice";

export function Groups() {
  const rounds = useAppSelector(selectRounds);
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
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Next round"
          onClick={() => dispatch(calculateNextRound())}
        >
          Next round
        </button>
        <span className={styles.value}>{}</span>
      </div>
    </div>
  );
}
