import React from "react";
import { getDesignInteraction } from "@canva/design-interaction";
import styles from "styles/components.css";

type AppElementData = {
  url: string;
  width: number;
  height: number;
};

type UIState = AppElementData;

const initialState: UIState = {
  url: "https://www.youtube.com/watch?v=o-YBDTqX_ZU",
  width: 640,
  height: 360,
};

export const App = () => {
  const designInteraction = getDesignInteraction<AppElementData>();

  const [state, setState] = React.useState<UIState>(initialState);

  const { url, width, height } = state;
  const disabled = url?.trim().length < 1 || !width || !height;

  React.useEffect(() => {
    designInteraction.registerRenderAppElement((data) => {
      return [{ type: "EMBED", ...data, top: 0, left: 0 }];
    });

    designInteraction.onAppElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, [designInteraction]);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>App embed elements</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can create embed elements inside app
        elements. This makes the element re-editable and lets apps control
        additional properties, such as the width and height.
      </p>

      <div className={styles.field}>
        <div className={styles.label}>URL</div>
        <input
          className={styles.textInput}
          type="text"
          value={url}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                url: event.target.value,
              };
            });
          }}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Width</div>
        <input
          className={styles.textInput}
          type="number"
          min={1}
          value={width.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                width: Number(event.target.value) || 1,
              };
            });
          }}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Height</div>
        <input
          className={styles.textInput}
          type="number"
          min={1}
          value={height.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                height: Number(event.target.value) || 1,
              };
            });
          }}
        />
      </div>

      <div className={styles.footer}>
        <button
          className={styles.button}
          onClick={() => {
            designInteraction.setAppElementData(state);
          }}
          disabled={disabled}
        >
          Add or update element
        </button>
      </div>
    </div>
  );
};
