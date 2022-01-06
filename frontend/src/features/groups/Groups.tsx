import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { calculateNextRound, selectParticipantsArray } from "./groupsSlice";
import styles from "./Groups.module.css";

export function Groups() {
  const participants = useAppSelector(selectParticipantsArray);
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
      {participants.map((participant) => (
        <div className={styles.row}>
          {participant.id}: {participant.name} ({participant.active})
        </div>
      ))}
      {participants.length !== 0 ? null : (
        <div className={styles.row}>Add some participants</div>
      )}
    </div>
  );
}
