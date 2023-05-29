import React from "react";
import { DraggableImage } from "../../components/draggable_image";
import styles from "styles/components.css";
import { tokens } from "styles/tokens";
import clsx from "clsx";
import dog from "assets/images/dog.jpg";
import { getContent } from "@canva/content";

const uploadImage = async () => {
  const content = getContent();
  const media = await content.queueMediaUpload({
    // An alphanumeric string that is unique for each media. If given the same id, the existing media for that id will be used instead.
    id: "uniqueIdentifier",
    mimeType: "image/svg+xml",
    thumbnailUrl:
      "https://static.canva.com/web/images/8f43953d9f0517df981dc113b8a7640c.svg",
    type: "IMAGE",
    url: "https://static.canva.com/web/images/8f43953d9f0517df981dc113b8a7640c.svg",
    width: 160,
    height: 22,
  });
  if (media.type === "failed") {
    // TODO: handle error case
    throw new Error(`media upload failed due to: ${media.reason}`);
  }
  return media;
};

export const App = () => {
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Drag and Drop</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can support drag-and-drop of images.
      </p>

      <div className={styles.subtitle}>Default size</div>

      <p
        className={clsx(styles.paragraph, styles.secondary)}
        style={{ marginBottom: tokens.xxSmallSpace }}
      >
        This image doesn't alter the{" "}
        <code className={styles.code}>dragData</code>, so the dragged image is
        the default size.
      </p>

      <DraggableImage
        src={dog}
        style={{ width: "100px", height: "100px", borderRadius: "2px" }}
      />

      <div className={styles.subtitle}>Custom size</div>

      <p
        className={clsx(styles.paragraph, styles.secondary)}
        style={{ marginBottom: tokens.xxSmallSpace }}
      >
        This image <em>does</em> alter the{" "}
        <code className={styles.code}>dragData</code>, so the dragged image is a
        custom size.
      </p>

      <DraggableImage
        src={dog}
        style={{ width: "100x", height: "100px", borderRadius: "2px" }}
        fullSize={{
          width: 50,
          height: 50,
        }}
      />

      <div className={styles.subtitle}>External Image</div>

      <p
        className={clsx(styles.paragraph, styles.secondary)}
        style={{ marginBottom: tokens.xxSmallSpace }}
      >
        This image is an external https image. It uses the content capability in
        conjunction with drag and drop.
      </p>

      <DraggableImage
        src={
          "https://static.canva.com/web/images/8f43953d9f0517df981dc113b8a7640c.svg"
        }
        width="160px"
        height="22px"
        resolveImageRef={uploadImage}
      />
    </div>
  );
};
