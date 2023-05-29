import React from "react";
import { getContent } from "@canva/content";
import { getDesignInteraction } from "@canva/design-interaction";
import styles from "styles/components.css";

export const App = () => {
  const content = getContent();
  const designInteraction = getDesignInteraction();

  // In this example, we will use random ids.
  // In a real app, you must use stable unique ids instead of random ids.
  const generateRandomId = (prefix: string) =>
    `${prefix}${btoa(Date.now().toString())}${btoa(
      (Math.random() * 1_000_000_000_000).toString()
    )}`.replace(/=+/g, "");

  const importAndAddImage = async () => {
    // Start uploading the image
    const queueUpload = await content.queueMediaUpload({
      type: "IMAGE",
      mimeType: "image/jpeg",
      url: "https://www.canva.dev/example-assets/image-import/image.jpg",
      thumbnailUrl:
        "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      // An alphanumeric string that is unique for each image. If given the same id, the existing image for that id will be used instead.
      id: generateRandomId("i"),
      width: 540,
      height: 720,
    });

    if (queueUpload.type !== "done") {
      // handle error case
      return;
    }

    // Add the image to the design, using the thumbnail at first, and replacing with the full image once the upload completes
    await designInteraction.addNativeElement({
      type: "IMAGE",
      ref: queueUpload.ref,
    });

    // Wait for the upload to finish so we can report errors if it fails to upload
    const result = await queueUpload.whenUploaded();

    if (result.type !== "done") {
      // handle error case
      return;
    }

    // upload is completed
    console.log("Upload complete!");
  };

  const importAndAddVideo = async () => {
    // Start uploading the video
    const queueUpload = await content.queueMediaUpload({
      type: "VIDEO",
      mimeType: "video/mp4",
      url: "https://www.canva.dev/example-assets/video-import/video.mp4",
      thumbnailImageUrl:
        "https://www.canva.dev/example-assets/video-import/thumbnail-image.jpg",
      thumbnailVideoUrl:
        "https://www.canva.dev/example-assets/video-import/thumbnail-video.mp4",
      // An alphanumeric string that is unique for each video. If given the same id, the existing video for that id will be used instead.
      id: generateRandomId("v"),
      width: 405,
      height: 720,
    });

    if (queueUpload.type !== "done") {
      // handle error case
      return;
    }

    // Add the video to the design, using the thumbnail at first, and replacing with the full image once the upload completes
    await designInteraction.addNativeElement({
      type: "VIDEO",
      ref: queueUpload.ref,
    });

    // Wait for the upload to finish so we can report errors if it fails to upload
    const result = await queueUpload.whenUploaded();

    if (result.type !== "done") {
      // handle error case
      return;
    }

    // upload is completed
    console.log("Upload complete!");
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Content</div>
      <p className={styles.paragraph}>
        This example demonstrates how apps can import media with the Content
        capability.
      </p>
      <div className={styles.field}>
        <button onClick={importAndAddImage} className={styles.button}>
          Import image
        </button>
      </div>
      <div className={styles.field}>
        <button onClick={importAndAddVideo} className={styles.button}>
          Import video
        </button>
      </div>
    </div>
  );
};
