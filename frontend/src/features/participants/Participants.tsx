import React, { useCallback, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { addParticipant, selectParticipantsArray } from "./participantSlice";
import styles from "./Participants.module.css";

export function Participants() {
  const participants = useAppSelector(selectParticipantsArray);
  const dispatch = useAppDispatch();
  const [participantName, setParticipantName] = useState("");

  const submitParticipant = useCallback(() => {
    if (participantName === "") {
      return;
    }
    const search = participantName.toLocaleLowerCase();
    const existingParticipant = participants.find(
      ({ name }) => name.toLocaleLowerCase() === search
    );
    if (typeof existingParticipant !== "undefined") {
      return;
    }
    dispatch(addParticipant(participantName));
    setParticipantName("");
  }, [participants, participantName, setParticipantName, dispatch]);

  return (
    <div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set participant name"
          value={participantName}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              submitParticipant();
            }
          }}
          onChange={(e) => setParticipantName(e.target.value)}
        />
        <button
          className={styles.button}
          aria-label="Add participant"
          onClick={submitParticipant}
        >
          Add participant
        </button>
      </div>
      {participants.map((participant) => (
        <div className={styles.row} key={participant.id}>
          {participant.id}: {participant.name} (
          {participant.active ? "active" : "disabled"})
        </div>
      ))}
      {participants.length !== 0 ? null : (
        <div className={styles.row}>Add some participants</div>
      )}
    </div>
  );
}
