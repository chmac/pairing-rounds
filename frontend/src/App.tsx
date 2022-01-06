import React from "react";
import "./App.css";
import { Groups } from "./features/groups/Groups";
import { Participants } from "./features/participants/Participants";
import { Reset } from "./features/reset/Reset";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pairing Rounds</h1>
      </header>
      <Participants />
      <Groups />
      <Reset />
    </div>
  );
}

export default App;
