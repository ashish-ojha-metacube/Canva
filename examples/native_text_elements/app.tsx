import { getDesignInteraction } from "@canva/design-interaction";
import React from "react";
import styles from "styles/components.css";

type UIState = {
  text: string;
  color: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  decoration: "none" | "underline";
  textAlign: "start" | "center" | "end";
};

const initialState: UIState = {
  text: "Hello world",
  color: "#ff0099",
  fontWeight: "normal",
  fontStyle: "normal",
  decoration: "none",
  textAlign: "start",
};

export const App = () => {
  const designInteraction = getDesignInteraction();

  const [state, setState] = React.useState<UIState>(initialState);

  const { text, color, fontWeight, fontStyle, decoration, textAlign } = state;
  const disabled = text.trim().length < 1 || color.trim().length < 1;

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Native text elements</div>
      <p className={styles.paragraph}>
        This example demonstrates how apps can create text elements as native
        elements.
      </p>
      <div className={styles.field}>
        <div className={styles.label}>Text</div>
        <input
          className={styles.textInput}
          type="text"
          value={text.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                text: event.target.value,
              };
            });
          }}
        />
      </div>

      <div className={styles.subtitle}>Custom options</div>

      <div className={styles.field}>
        <div className={styles.label}>Color</div>
        <input
          className={styles.textInput}
          type="text"
          value={color}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                color: event.target.value,
              };
            });
          }}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Font style</div>
        <select
          className={styles.select}
          value={fontStyle}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                fontStyle: event.target.value as "normal" | "italic",
              };
            });
          }}
        >
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
        </select>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Font weight</div>
        <select
          className={styles.select}
          value={fontWeight}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                fontWeight: event.target.value as "normal" | "bold",
              };
            });
          }}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Decoration</div>
        <select
          className={styles.select}
          value={decoration}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                decoration: event.target.value as "none" | "underline",
              };
            });
          }}
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
        </select>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Text align</div>
        <select
          className={styles.select}
          value={textAlign}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                textAlign: event.target.value as "start" | "center" | "end",
              };
            });
          }}
        >
          <option value="start">Start</option>
          <option value="center">Center</option>
          <option value="end">End</option>
        </select>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.button}
          onClick={() => {
            designInteraction.addNativeElement({
              type: "TEXT",
              ...state,
              children: [state.text],
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
