import React from "react";
import { getDesignInteraction } from "@canva/design-interaction";
import styles from "styles/components.css";

export const App = () => {
  const designInteraction = getDesignInteraction();
  const [url, setUrl] = React.useState(
    "https://www.youtube.com/watch?v=o-YBDTqX_ZU"
  );
  const disabled = url.trim().length < 1;

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Native embed elements</div>
      <p className={styles.paragraph}>
        This example demonstrates how apps can add native embed elements to a
        design.
      </p>
      <div>
        <div className={styles.label}>URL</div>
        <input
          className={styles.textInput}
          type="text"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
          }}
        />
      </div>
      <div className={styles.footer}>
        <button
          className={styles.button}
          onClick={() => {
            designInteraction.addNativeElement({
              type: "EMBED",
              url,
            });
          }}
          disabled={disabled}
        >
          Add element
        </button>
      </div>
    </div>
  );
};
