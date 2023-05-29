import React, { useState } from "react";
import { getDesignInteraction } from "@canva/design-interaction";
import styles from "styles/components.css";
import clsx from "clsx";
import { getImageFromUrl, ImageType } from "../../utils/get_image_from_url";

const IMAGE_URL = "https://picsum.photos/200/200.jpg";
/**
 * You can run ngrok in this example and enter your ngrok route here to test proxying of
 * images.
 */
const HTTPS_BACKEND_URL = "enter-your-https-backend-route-here";

/**
 * if the image you wish to load has strict CORS headers, you can use the provided backend as a
 * proxy, which will strip the CORS headers.
 */
const PROXIED_IMAGE_URL = `${HTTPS_BACKEND_URL}/image?url=${IMAGE_URL}`;

type State = "idle" | "loading" | "success" | "error";

export const App = () => {
  const designInteraction = getDesignInteraction();
  const [state, setState] = useState<State>("idle");

  const fetchAndAddImage = async () => {
    try {
      setState("loading");

      // Fetch the image from the URL
      const image = await getImageFromUrl({
        type: ImageType.JPEG,
        url: IMAGE_URL,
      });

      // Add the element to the design
      await designInteraction.addNativeElement({
        type: "IMAGE",
        dataUrl: image.base64Encode(),
      });

      setState("idle");
    } catch (e) {
      setState("error");
      console.error(e);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Fetching images</div>
      <p className={styles.paragraph}>
        This example demonstrates how apps can fetch an image from a URL and add
        it to the user's design.
      </p>

      {/* Idle and loading state */}
      {state !== "error" && (
        <>
          <div className={styles.field}>
            <button
              className={clsx(
                styles.button,
                state === "loading" && styles.loading
              )}
              onClick={fetchAndAddImage}
            >
              Fetch and add image
            </button>
          </div>
        </>
      )}

      {/* Error state */}
      {state === "error" && (
        <div>
          <div className={styles.subtitle}>Something went wrong</div>
          <p className={styles.paragraph}>
            To see the error, check the JavaScript Console.
          </p>
          <button
            className={clsx(styles.button, styles.secondary)}
            onClick={() => {
              setState("idle");
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
