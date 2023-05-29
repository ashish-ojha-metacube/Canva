import React from "react";
import {
  AppElementRendererOutput,
  getDesignInteraction,
} from "@canva/design-interaction";
import type { NativeShapeElementWithBox } from "@canva/design-interaction";
import styles from "styles/components.css";

// The data that will be attached to the app element
type AppElementData = {
  rows: number;
  columns: number;
  width: number;
  height: number;
  spacing: number;
  rotation: number;
};

// The state of the user interface. In this example, this is the same
// as AppElementData, but it *could* be different.
type UIState = AppElementData;

// The default values for the UI components.
const initialState: UIState = {
  rows: 3,
  columns: 3,
  width: 100,
  height: 100,
  spacing: 25,
  rotation: 0,
};

export const App = () => {
  const designInteraction = getDesignInteraction<AppElementData>();

  const [state, setState] = React.useState<UIState>(initialState);
  const { width, height, rows, columns, spacing, rotation } = state;
  const disabled = width < 1 || height < 1 || rows < 1 || columns < 1;

  React.useEffect(() => {
    // This callback runs when the app sets the element's data. It receives
    // the data and must respond with an array of elements.
    designInteraction.registerRenderAppElement((data) => {
      const elements: AppElementRendererOutput = [];

      // For each row and column, create a shape element. The positions of the
      // elements are offset to ensure that none of them overlap.
      for (let row = 0; row < data.rows; row++) {
        for (let column = 0; column < data.columns; column++) {
          const { width, height, spacing, rotation } = data;
          const top = row * (height + spacing);
          const left = column * (width + spacing);
          const element = createSquareShapeElement({
            width,
            height,
            top,
            left,
            rotation,
          });
          elements.push(element);
        }
      }
      return elements;
    });

    // This callback runs when the app element's data is modified or when the
    // user selects an app element. In both situations, we can use this callback
    // to update the state of the UI to reflect the latest data.
    designInteraction.onAppElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, [designInteraction]);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>App element children</div>

      <p className={styles.paragraph}>
        This example demonstrates how app elements can be made up of one or more
        elements, and how those elements can be positioned relatively to one
        another.
      </p>

      <div className={styles.subtitle}>Grid</div>

      <div className={styles.field}>
        <div className={styles.label}>Rows</div>
        <input
          className={styles.textInput}
          type="number"
          value={rows.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                rows: Number(event.target.value),
              };
            });
          }}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Columns</div>
        <input
          className={styles.textInput}
          type="number"
          value={columns.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                columns: Number(event.target.value),
              };
            });
          }}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Spacing</div>
        <input
          className={styles.textInput}
          type="number"
          value={spacing.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                spacing: Number(event.target.value),
              };
            });
          }}
        />
      </div>

      <div className={styles.subtitle}>Squares</div>

      <div className={styles.field}>
        <div className={styles.label}>Width</div>
        <input
          className={styles.textInput}
          type="number"
          value={width.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                width: Number(event.target.value),
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
          value={height.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                height: Number(event.target.value),
              };
            });
          }}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Rotation</div>
        <input
          className={styles.textInput}
          type="number"
          min={-180}
          max={180}
          value={rotation.toString()}
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
            // This method attaches the provided data to the app element,
            // triggering the `registerRenderAppElement` callback.
            designInteraction.setAppElementData(state);
          }}
          disabled={disabled}
        >
          Add element to design
        </button>
      </div>
    </div>
  );
};

const createSquareShapeElement = ({
  width,
  height,
  top,
  left,
  rotation,
}: {
  width: number;
  height: number;
  top: number;
  left: number;
  rotation: number;
}): NativeShapeElementWithBox => {
  return {
    type: "SHAPE",
    paths: [
      {
        d: `M 0 0 H ${width} V ${height} H 0 L 0 0`,
        fill: {
          color: "#ff0099",
        },
      },
    ],
    viewBox: {
      width,
      height,
      top: 0,
      left: 0,
    },
    width,
    height,
    rotation,
    top,
    left,
  };
};
