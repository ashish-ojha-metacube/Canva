import React from "react";
import styles from "styles/components.css";
import { tokens } from "styles/tokens";
import clsx from "clsx";
import { getContent } from "@canva/content";
import { DraggableVideo } from "components/draggable_video";

const uploadVideo = async () => {
  const content = getContent();
  const media = await content.queueMediaUpload({
    // An alphanumeric string that is unique for each media. If given the same id, the existing media for that id will be used instead.
    id: "uniqueVideoIdentifier",
    mimeType: "video/mp4",
    thumbnailImageUrl:
      "https://www.canva.dev/example-assets/video-import/thumbnail-image.jpg",
    thumbnailVideoUrl:
      "https://www.canva.dev/example-assets/video-import/thumbnail-video.mp4",
    type: "VIDEO",
    url: "https://www.canva.dev/example-assets/video-import/video.mp4",
    width: 405,
    height: 720,
  });
  if (media.type === "failed") {
    throw new Error(`media upload failed due to: ${media.reason}`);
  }
  return media;
};

export const App = () => {
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Drag and Drop</div>

      <p className={styles.paragraph}>
        This example demonstrates how apps can support drag-and-drop of videos.
      </p>

      <div className={styles.subtitle}>External Video</div>

      <p
        className={clsx(styles.paragraph, styles.secondary)}
        style={{ marginBottom: tokens.xxSmallSpace }}
      >
        This video is an external https video. It uses the content capability in
        conjunction with drag and drop.
      </p>

      <DraggableVideo
        width={270}
        height={480}
        thumbnailImageSrc="https://www.canva.dev/example-assets/video-import/thumbnail-image.jpg"
        thumbnailVideoSrc="https://www.canva.dev/example-assets/video-import/thumbnail-video.mp4"
        durationInSeconds={7}
        resolveVideoRef={uploadVideo}
        mimeType="video/mp4"
      />
    </div>
  );
};
