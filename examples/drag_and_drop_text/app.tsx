import React from "react";
import styles from "styles/components.css";
import clsx from "clsx";
import { DraggableText } from "../../components/draggable_text";

type DraggableTextProperties = {
  textAlign?: "start" | "center" | "end";
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  decoration?: "none" | "underline";
};

export const App = () => {
  const [{ fontStyle, fontWeight, decoration, textAlign }, setState] =
    React.useState<Required<DraggableTextProperties>>({
      decoration: "none",
      fontStyle: "normal",
      fontWeight: "normal",
      textAlign: "start",
    });
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Text Drag and Drop</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can support drag-and-drop of text.
      </p>

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

      <DraggableText
        className={clsx(styles.paragraph, styles.secondary)}
        style={{
          textAlign,
          textDecorationLine: decoration,
          fontStyle,
          fontWeight,
        }}
      >
        Drag me!
      </DraggableText>
    </div>
  );
};
