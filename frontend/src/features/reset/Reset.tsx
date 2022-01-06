import React from "react";

import { persistor } from "../../app/store";

export function Reset() {
  return (
    <div>
      <button
        onClick={() => {
          if (
            !globalThis.confirm(
              "Are you sure you want to delete all data and start over? #sl7lqg"
            )
          ) {
            return;
          }
          persistor.purge();
          globalThis.window.location.reload();
        }}
      >
        Reset
      </button>{" "}
      -{" "}
      <a
        href="https://github.com/chmac/pairing-rounds"
        target="_blank"
        rel="noreferrer"
      >
        Help
      </a>
    </div>
  );
}
