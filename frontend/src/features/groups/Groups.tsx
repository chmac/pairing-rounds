import React from "react";
import { useAppDispatch } from "../../app/hooks";
import styles from "./Groups.module.css";
import { calculateNextRound } from "./groupsSlice";

export function Groups() {
  // const participants = useAppSelector(selectParticipantsArray);
  const dispatch = useAppDispatch();

  return (
    <div>
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
