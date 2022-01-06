import React from "react";
import { Participants } from "./features/participants/Participants";
import { Groups } from "./features/groups/Groups";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pairing Rounds</h1>
      </header>
      <Participants />
      <Groups />
    </div>
  );
}

export default App;
