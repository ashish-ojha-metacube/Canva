import { getDesignInteraction } from "@canva/design-interaction";
import React from "react";
import styles from "../../styles/components.css";

export const App = () => {
  const designInteraction = getDesignInteraction();

  const handleClick = () => {
    designInteraction.addNativeElement({
      type: "GROUP",
      children: [
        {
          type: "EMBED",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          width: 100,
          height: 100,
          top: 0,
          left: 0,
        },
        {
          type: "EMBED",
          url: "https://www.youtube.com/watch?v=o-YBDTqX_ZU",
          width: 100,
          height: 100,
          top: 0,
          left: 100,
        },
      ],
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Native group elements</div>
      <p className={styles.paragraph}>
        This example demonstrates how apps can create groups of elements.
      </p>
      <div className={styles.footer}>
        <button className={styles.button} onClick={handleClick}>
          Add group element
        </button>
      </div>
    </div>
  );
};
