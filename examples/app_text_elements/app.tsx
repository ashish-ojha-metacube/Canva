import React from "react";
import styles from "styles/components.css";
import { getDesignInteraction } from "@canva/design-interaction";

type AppElementData = {
  text: string;
  color: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  decoration: "none" | "underline";
  textAlign: "start" | "center" | "end";
  width: number;
  rotation: number;
  useCustomWidth: boolean;
};

type UIState = AppElementData;

const initialState: UIState = {
  text: "Hello world",
  color: "#ff0099",
  fontWeight: "normal",
  fontStyle: "normal",
  decoration: "none",
  textAlign: "start",
  width: 250,
  rotation: 0,
  useCustomWidth: false,
};

export const App = () => {
  const designInteraction = getDesignInteraction<AppElementData>();

  const [state, setState] = React.useState<UIState>(initialState);

  const {
    text,
    color,
    fontWeight,
    fontStyle,
    decoration,
    textAlign,
    width,
    rotation,
    useCustomWidth,
  } = state;

  const disabled = text.trim().length < 1 || color.trim().length < 1;

  React.useEffect(() => {
    designInteraction.registerRenderAppElement((data) => {
      return [
        {
          type: "TEXT",
          top: 0,
          left: 0,
          ...data,
          width: data.useCustomWidth ? data.width : undefined,
          children: [data.text],
        },
      ];
    });

    designInteraction.onAppElementChange((appElement) => {
      if (appElement) {
        setState(appElement.data);
      } else {
        setState(initialState);
      }
    });
  }, [designInteraction]);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>App text elements</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can create text elements inside app
        elements. This makes the element re-editable and lets apps control
        additional properties, such as the width and height.
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

      <div className={styles.field}>
        <div className={styles.label}>Width</div>
        <div className={styles.radio}>
          <input
            id="fitToContent"
            type="radio"
            checked={!useCustomWidth}
            onChange={() => {
              setState((prevState) => {
                return {
                  ...prevState,
                  useCustomWidth: false,
                };
              });
            }}
          />
          <label htmlFor="fitToContent">Fit to content</label>
        </div>
        <div className={styles.radio}>
          <input
            id="customWidth"
            type="radio"
            checked={useCustomWidth}
            onChange={() => {
              setState((prevState) => {
                return {
                  ...prevState,
                  useCustomWidth: true,
                };
              });
            }}
          />
          <label htmlFor="customWidth">Use custom width</label>
        </div>
      </div>

      {useCustomWidth ? (
        <div className={styles.field}>
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
      ) : undefined}

      <div className={styles.field}>
        <div className={styles.label}>Rotation</div>
        <input
          className={styles.textInput}
          type="number"
          min={-180}
          max={180}
          value={rotation}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                rotation: Number(event.target.value),
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
