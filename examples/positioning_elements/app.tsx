import React from "react";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import styles from "styles/components.css";
import { getDesignInteraction, Placement } from "@canva/design-interaction";
import clsx from "clsx";

// Below values are only for demonstration purposes.
// You can position your elements anywhere on the page by providing arbitrary values for
// placement attributes: top, left, width, height and rotation.
const enum ElementPlacement {
  DEFAULT = "default",
  TOP_LEFT = "top_left",
  TOP_RIGHT = "top_right",
  BOTTOM_LEFT = "bottom_left",
  BOTTOM_RIGHT = "bottom_right",
}

// We can't store the image's data URL in the app element's data, since it exceeds
// the 5kb limit. We can, however, store an ID that references the image.
type AppElementData = {
  imageId: string;
};

type UIState = AppElementData & {
  dataUrl: string;
  placement?: ElementPlacement;
  isEditingAppElement: boolean;
};

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
  dataUrl: images.dog.imageSrc,
  placement: ElementPlacement.DEFAULT,
  isEditingAppElement: false,
};

export const App = () => {
  const designInteraction = getDesignInteraction<AppElementData>();
  const [state, setState] = React.useState<UIState>(initialState);
  const { imageId } = state;
  const disabled = !imageId || imageId.trim().length < 1;

  const getPlacement = async (
    placement?: ElementPlacement
  ): Promise<Placement | undefined> => {
    const pageContext = await designInteraction.getCurrentPageContext();
    const pageDimensions = pageContext.dimensions;
    if (!pageDimensions) {
      // Current doctype doesn't support absolute positioning
      return;
    }

    const elementSize =
      Math.min(pageDimensions.height, pageDimensions.width) / 2;
    switch (placement) {
      case ElementPlacement.TOP_LEFT:
        return {
          top: 0,
          left: 0,
          width: elementSize,
          height: elementSize,
          rotation: 0,
        };
      case ElementPlacement.TOP_RIGHT:
        return {
          top: 0,
          left: pageDimensions.width - elementSize,
          width: elementSize,
          height: elementSize,
          rotation: 0,
        };
      case ElementPlacement.BOTTOM_LEFT:
        return {
          top: pageDimensions.height - elementSize,
          left: 0,
          width: elementSize,
          height: elementSize,
          rotation: 0,
        };
      case ElementPlacement.BOTTOM_RIGHT:
        return {
          top: pageDimensions.height - elementSize,
          left: pageDimensions.width - elementSize,
          width: elementSize,
          height: elementSize,
          rotation: 0,
        };
      default:
        return undefined;
    }
  };

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
            dataUrl: imageSrc,
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
          dataUrl: images[data.imageId].imageSrc,
          top: 0,
          left: 0,
          width: 400,
          height: 400,
        },
      ];
    });

    designInteraction.onAppElementChange((appElement) => {
      setState((prevState) => {
        return appElement
          ? {
              ...prevState,
              ...appElement.data,
              isEditingAppElement: Boolean(appElement.data),
            }
          : { ...prevState, isEditingAppElement: false };
      });
    });
  }, [designInteraction]);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Positioning elements</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can get the dimensions of the current
        page and create elements at specific positions on that page.
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
        />
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Placement</div>
        <select
          className={styles.select}
          value={state.placement}
          onChange={(event) => {
            setState((prevState) => {
              return {
                ...prevState,
                placement: event.target.value as ElementPlacement,
              };
            });
          }}
        >
          <option value={ElementPlacement.DEFAULT}>Default</option>
          <option value={ElementPlacement.TOP_LEFT}>Top Left</option>
          <option value={ElementPlacement.TOP_RIGHT}>Top Right</option>
          <option value={ElementPlacement.BOTTOM_LEFT}>Bottom Left</option>
          <option value={ElementPlacement.BOTTOM_RIGHT}>Bottom Right</option>
        </select>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.button}
          onClick={async () => {
            const placement = await getPlacement(state.placement);
            designInteraction.setAppElementData(
              { imageId: state.imageId },
              placement
            );
          }}
          disabled={disabled}
        >
          {state.isEditingAppElement ? "Update app element" : "Add app element"}
        </button>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.button}
          onClick={async () => {
            const placement = await getPlacement(state.placement);
            designInteraction.addNativeElement({
              type: "IMAGE",
              dataUrl: state.dataUrl,
              ...placement,
            });
          }}
          disabled={disabled}
        >
          Add native element
        </button>
      </div>
    </div>
  );
};
