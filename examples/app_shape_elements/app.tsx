import React from "react";
import { getDesignInteraction } from "@canva/design-interaction";
import styles from "styles/components.css";
import clsx from "clsx";
import { tokens } from "styles/tokens";

type AppElementData = {
  paths: {
    d: string;
    fill: {
      color: string;
    };
  }[];
  viewBox: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  width: number;
  height: number;
  rotation: number;
};

type UIState = AppElementData;

const initialState: UIState = {
  paths: [
    {
      d: "M 0 0 H 100 V 100 H 0 L 0 0",
      fill: {
        color: "#ff0099",
      },
    },
  ],
  viewBox: {
    width: 100,
    height: 100,
    top: 0,
    left: 0,
  },
  width: 100,
  height: 100,
  rotation: 0,
};

export const App = () => {
  const designInteraction = getDesignInteraction<AppElementData>();

  const [state, setState] = React.useState<UIState>(initialState);

  const { paths, viewBox, width, height, rotation } = state;
  const disabled = paths.length < 1;

  React.useEffect(() => {
    designInteraction.registerRenderAppElement((data) => {
      return [{ type: "SHAPE", top: 0, left: 0, ...data }];
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
      <div className={styles.header}>App shape elements</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can create shape elements inside app
        elements. This makes the element re-editable and lets apps control
        additional properties, such as the width and height.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          lineHeight: 1,
          marginBottom: tokens.xSmallSpace,
          height: "34px",
        }}
      >
        <div className={styles.subtitle} style={{ margin: 0 }}>
          Paths
        </div>
        {paths.length < 7 && (
          <button
            onClick={() => {
              setState((prevState) => {
                return {
                  ...prevState,
                  paths: [
                    ...prevState.paths,
                    {
                      d: "",
                      fill: {
                        color: "#000000",
                      },
                    },
                  ],
                };
              });
            }}
            style={{
              appearance: "none",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            <PlusIcon />
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.xSmallSpace,
        }}
      >
        {paths.map((path, outerIndex) => {
          return (
            <div className={styles.panel} key={outerIndex}>
              <div className={styles.field}>
                <div className={styles.label}>Line commands</div>
                <input
                  className={styles.textInput}
                  type="text"
                  value={path.d}
                  onChange={(event) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        paths: prevState.paths.map((path, innerIndex) => {
                          if (outerIndex === innerIndex) {
                            return {
                              ...path,
                              d: event.target.value,
                            };
                          }
                          return path;
                        }),
                      };
                    });
                  }}
                />
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Color</div>
                <input
                  className={styles.textInput}
                  type="text"
                  value={paths[outerIndex].fill.color}
                  onChange={(event) => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        paths: prevState.paths.map((path, innerIndex) => {
                          if (outerIndex === innerIndex) {
                            return {
                              ...path,
                              fill: {
                                ...path.fill,
                                color: event.target.value,
                              },
                            };
                          }
                          return path;
                        }),
                      };
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.subtitle}>Viewbox</div>

      <div className={styles.field}>
        <div className={styles.label}>Width</div>
        <input
          className={styles.textInput}
          type="number"
          min={1}
          value={viewBox.width.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                viewBox: {
                  ...prevState.viewBox,
                  width: Number(event.target.value) || 1,
                },
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
          value={viewBox.height.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                viewBox: {
                  ...prevState.viewBox,
                  height: Number(event.target.value) || 1,
                },
              };
            });
          }}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Top</div>
        <input
          className={styles.textInput}
          type="number"
          min={0}
          value={viewBox.top.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                viewBox: {
                  ...prevState.viewBox,
                  top: Number(event.target.value),
                },
              };
            });
          }}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Left</div>
        <input
          className={styles.textInput}
          type="number"
          value={viewBox.left.toString()}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                viewBox: {
                  ...prevState.viewBox,
                  left: Number(event.target.value),
                },
              };
            });
          }}
        />
      </div>

      <div className={styles.subtitle}>Position</div>

      <div className={styles.field}>
        <div className={styles.label}>Width</div>
        <input
          className={styles.textInput}
          type="number"
          min={0}
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
          className={clsx(styles.button, styles.secondary)}
          onClick={() => {
            setState(initialState);
          }}
        >
          Reset
        </button>
        <button
          className={styles.button}
          onClick={() => {
            designInteraction.setAppElementData(state);
          }}
          disabled={disabled}
        >
          Add shape to design
        </button>
      </div>
    </div>
  );
};

const PlusIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.875 24C14.875 24.5523 15.3227 25 15.875 25H16.125C16.6773 25 17.125 24.5523 17.125 24V17.125H24C24.5523 17.125 25 16.6773 25 16.125V15.875C25 15.3227 24.5523 14.875 24 14.875H17.125V8C17.125 7.44772 16.6773 7 16.125 7H15.875C15.3227 7 14.875 7.44772 14.875 8V14.875H8C7.44772 14.875 7 15.3227 7 15.875V16.125C7 16.6773 7.44772 17.125 8 17.125H14.875V24Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
};
