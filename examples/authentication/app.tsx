import { getAuthentication } from "@canva/authentication";
import type { Authentication } from "@canva/authentication";
import React from "react";
import styles from "styles/components.css";
import { tokens } from "styles/tokens";
import clsx from "clsx";

type State = "authenticated" | "not_authenticated" | "checking" | "error";

// TODO: Replace this with your backend server
const BACKEND_BASE = "http://localhost:3001";

/**
 * This endpoint is defined in the ./backend/server.ts file. You need to
 * register the endpoint in the Developer Portal before sending requests.
 */
const AUTHENTICATION_CHECK_ENDPOINT = "/authentication/check";

const checkAuthenticationStatus = async (
  auth: Authentication
): Promise<State> => {
  /**
   * Send a request to an endpoint that checks if the user is authenticated. This
   * is a (very) rudimentary implementation.
   *
   * Note: You must register the provided endpoint via the Developer Portal.
   */
  try {
    const token = await auth.getCanvaUserToken();
    const res = await fetch(`${BACKEND_BASE}${AUTHENTICATION_CHECK_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
    });
    const body = await res.json();

    if (body?.isAuthenticated) {
      return "authenticated";
    } else {
      return "not_authenticated";
    }
  } catch (error) {
    console.error(error);
    return "error";
  }
};

export const App = () => {
  const auth = getAuthentication();

  // Keep track of the user's authentication status.
  const [state, setState] = React.useState<State>("checking");

  React.useEffect(() => {
    checkAuthenticationStatus(auth).then((status) => {
      setState(status);
    });
  }, []);

  const startAuthenticationFlow = async () => {
    // Start the authentication flow
    try {
      const result = await auth.authenticate();
      // Handle the result of the authentication flow
      switch (result.type) {
        case "authenticated":
          setState("authenticated");
          break;
        case "canceled":
          console.warn("authentication canceled");
          setState("not_authenticated");
          break;
        case "denied":
          console.warn("authentication denied", result.details);
          setState("not_authenticated");
          break;
        case "failed":
          console.error("authentication failed", result.reason);
          setState("not_authenticated");
      }
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  if (state === "error") {
    return (
      <div>
        <div className={styles.header}>Authentication</div>
        <div>
          <strong>Something went wrong.</strong> Check the JavaScript Console
          for details.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Authentication</div>
      <p className={styles.paragraph}>
        This example demonstrates how apps can allow users to authenticate with
        the app via a third-party platform.
      </p>
      <div className={styles.subtitle}>Try the authentication flow</div>
      <p className={clsx(styles.paragraph, styles.secondary)}>
        To test the authentication flow, click the button below. The username is
        "username" and the password is "password".
      </p>
      <p
        className={styles.paragraph}
        style={{ marginTop: tokens.mediumSpace, textAlign: "center" }}
      >
        {createAuthenticationMessage(state)}
      </p>
      <button
        className={styles.button}
        onClick={startAuthenticationFlow}
        disabled={state === "authenticated" || state === "checking"}
      >
        Start authentication flow
      </button>
    </div>
  );
};

const createAuthenticationMessage = (state: State) => {
  switch (state) {
    case "checking":
      return "Checking authentication status...";
    case "authenticated":
      return "You are authenticated!";
    case "not_authenticated":
      return "You are not authenticated.";
  }
};
