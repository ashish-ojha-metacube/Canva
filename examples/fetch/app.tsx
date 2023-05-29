import React, { useState } from "react";
import styles from "styles/components.css";
import { tokens } from "styles/tokens";
import { getAuthentication } from "@canva/authentication";
import clsx from "clsx";

const BACKEND_URL = "http://localhost:3001/custom-route";

type State = "idle" | "loading" | "success" | "error";

export const App = () => {
  const auth = getAuthentication();
  const [state, setState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined
  );

  const sendGetRequest = async () => {
    try {
      setState("loading");
      const token = await auth.getCanvaUserToken();
      const res = await fetch(BACKEND_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await res.json();
      setResponseBody(body);
      setState("success");
    } catch (error) {
      setState("error");
      console.error(error);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Fetch</div>
      <p className={styles.paragraph}>
        This example demonstrates how apps can send GET requests with the Fetch
        capability.
      </p>

      {/* Idle and loading state */}
      {state !== "error" && (
        <>
          <div className={styles.field}>
            <button
              className={clsx(
                styles.button,
                state === "loading" && styles.loading
              )}
              onClick={sendGetRequest}
            >
              Send GET request
            </button>
          </div>

          {state === "success" && responseBody && (
            <div style={{ marginTop: tokens.mediumSpace }}>
              <div className={styles.label}>Response</div>
              <pre className={styles.pre}>
                <code>{JSON.stringify(responseBody, null, 2)}</code>
              </pre>
            </div>
          )}
        </>
      )}

      {/* Error state */}
      {state === "error" && (
        <div>
          <div className={styles.subtitle}>Something went wrong</div>
          <p className={styles.paragraph}>
            To see the error, check the JavaScript Console.
          </p>
          <button
            className={clsx(styles.button, styles.secondary)}
            onClick={() => {
              setState("idle");
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
