import React from "react";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import { getDesignInteraction } from "@canva/design-interaction";
import styles from "styles/components.css";
import clsx from "clsx";

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

export const App = () => {
  const designInteraction = getDesignInteraction();
  const [dataUrl, setDataUrl] = React.useState(dog);
  const [isLoading, setIsLoading] = React.useState(false);
  const disabled = !dataUrl || dataUrl.trim().length < 1;

  const items = Object.entries(images).map(([key, value]) => {
    const { title, imageSrc } = value;
    return {
      key,
      title,
      imageSrc,
      active: dataUrl === imageSrc,
      onClick: () => {
        setDataUrl(imageSrc);
      },
    };
  });

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Native image elements</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can add native image elements to a
        design.
      </p>

      <div>
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
          type="text"
          className={styles.textInput}
          value={dataUrl}
          disabled
        />
      </div>

      <div className={styles.footer}>
        <button
          className={clsx(styles.button, isLoading && styles.loading)}
          disabled={disabled}
          onClick={async () => {
            try {
              setIsLoading(true);
              await designInteraction.addNativeElement({
                type: "IMAGE",
                dataUrl,
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          Add element
        </button>
      </div>
    </div>
  );
};
