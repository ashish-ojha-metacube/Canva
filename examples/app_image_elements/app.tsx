import React from "react";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import styles from "styles/components.css";
import { getDesignInteraction } from "@canva/design-interaction";
import clsx from "clsx";

// We can't store the image's data URL in the app element's data, since it exceeds
// the 5kb limit. We can, however, store an ID that references the image.
type AppElementData = {
  imageId: string;
  width: number;
  height: number;
  rotation: number;
};

type UIState = AppElementData;

const images = {
  dog: {
    title: "Dog",
    imageSrc: dog,
  },
  cat: {
    title: "Cat",
    imageSrc: cat,
  },
  rabbit: {
    title: "Rabbit",
    imageSrc: rabbit,
  },
};

const initialState: UIState = {
  imageId: "dog",
  width: 400,
  height: 400,
  rotation: 0,
};

export const App = () => {
  const designInteraction = getDesignInteraction<AppElementData>();
  const [state, setState] = React.useState<UIState>(initialState);
  const { imageId, width, height, rotation } = state;
  const disabled = !imageId || imageId.trim().length < 1;

  const items = Object.entries(images).map(([key, value]) => {
    const { title, imageSrc } = value;
    return {
      key,
      title,
      imageSrc,
      active: imageId === key,
      onClick: () => {
        setState((prevState) => {
          return {
            ...prevState,
            imageId: key,
          };
        });
      },
    };
  });

  React.useEffect(() => {
    designInteraction.registerRenderAppElement((data) => {
      return [
        {
          type: "IMAGE",
          top: 0,
          left: 0,
          dataUrl: images[data.imageId].imageSrc,
          ...data,
        },
      ];
    });

    designInteraction.onAppElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, [designInteraction]);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>App image elements</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can create image elements inside app
        elements. This makes the element re-editable and lets apps control
        additional properties, such as the width and height.
      </p>

      <div className={styles.field}>
        <div className={styles.subtitle}>Select an image</div>
        <div className={styles.thumbnailGrid}>
          {items.map((item) => (
            <img
              className={clsx(styles.thumbnail, item.active && styles.active)}
              key={item.key}
              src={item.imageSrc}
              onClick={item.onClick}
              alt={item.title}
            />
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Data URL</div>
        <input
          className={styles.textInput}
          type="text"
          value={images[imageId].imageSrc}
          onChange={() => {}}
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
          Add image to design
        </button>
      </div>
    </div>
  );
};
