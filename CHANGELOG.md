# Changelog

## 2023-04-14

### 🔧 Changed

- The recommended node version has changed from v14.18.1 to v18.15.0.
- The JWT middleware now uses the real Canva public key service.
- The JWT middleware has been renamed from `createJWTMiddleware` to `createJwtMiddleware`.

### 🐞 Fixed

- Draggable and clickable elements occasionally flashing when they are clicked.

### 🗑️ Removed

- The Canva Mock JWT Server has been removed as the real Canva public key service has been released.

## 2023-03-15

### 🧰 Added

- Integration between the [Drag and Drop](https://www.canva.dev/docs/apps/drag-drop/) and [Content](https://www.canva.dev/docs/apps/content/) capabilities. This makes it possible to import videos via Canva's backend when a user drags a video into their design.
- An example of how Drag and Drop of video can be used, including a `DraggableVideo` component.

## 2023-03-10

### 🧰 Added

- The ability to create video elements with the [Design Interaction](https://www.canva.dev/docs/apps/design-interaction/) capability. [Learn more](https://www.canva.dev/docs/apps/design-interaction/video-elements/).
- Support for importing video files into the user's media library via external URLs. [Learn more](https://www.canva.dev/docs/apps/content/upload-media/).
- An example that demonstrates how to import videos with the [Content](https://www.canva.dev/docs/apps/content/) capability.
- Integration between the [Drag and Drop](https://www.canva.dev/docs/apps/drag-drop/) and [Content](https://www.canva.dev/docs/apps/content/) capabilities. This makes it possible to import videos via Canva's backend when a user drags a video into their design.

### 🔧 Changed

- The `AppElementRenderer` function returns `AppElementRendererOutput` instead of `NativeSimpleElementWithBox[]`.

## 2023-03-01

### 🧰 Added

- Integration between the [Drag and Drop](https://www.canva.dev/docs/apps/drag-drop/) and [Content](https://www.canva.dev/docs/apps/content/) capabilities. This makes it possible to import images via Canva's backend when a user drags an image into their design. [See the documentation](https://www.canva.dev/docs/apps/drag-drop/import-media/).

### 🔧 Changed

- The `drag_and_drop_image` example demonstrates the integration between the Drag and Drop and Content capabilities.
- The `DraggableImage` component makes the node draggable when the image loads instead of when the component mounts.

### 🐞 Fixed

- Some typos in the `app_shape_elements` example.

## 2023-02-20

### 💥 Breaking changes

- Removed the `@canva/fetch` package.

### 🧰 Added

- Support for the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), so apps can send HTTP requests in a familiar way.
- An example that demonstrates how to use the Fetch API. [See the example](https://github.com/canva-sdks/canva-api-starter-kit-beta/tree/master/examples/fetch).
- A `getCanvaUserToken` method that generates a JWT for securing requests. [Learn more](https://canva.dev/docs/apps/send-request/).
- An Express.js middleware for decoding and verifying JWTs. [See the middleware](https://github.com/canva-sdks/canva-api-starter-kit-beta/tree/master/utils/backend/jwt_middleware).
- An Express.js backend that all other example backends extend. This offers a number of quality of life improvements, such as better security and error handling. [See the backend](https://github.com/canva-sdks/canva-api-starter-kit-beta/tree/master/utils/backend/base_backend).
- A couple of CSS classes — `.placeholder` and `.pulse` — for creating loading animations.
- Support for the Jest testing library.

### 🔧 Changed

- Hot Module Replacement (HMR) is disabled by default. To enable it, set the `CANVA_HRM_ENABLED` environment variable to `true` and the `CANVA_APP_ID` environment variable to the ID of an app. You can set the environment variables in the `.env` file.
- Updated the `authentication` example to use the native Fetch API. [See the example](https://github.com/canva-sdks/canva-api-starter-kit-beta/tree/main/examples/authentication).

### 🐞 Fixed

- The `authentication` example not displaying error messages in the JavaScript Console.

### 🗑️ Removed

- All code and examples that depend on the `@canva/fetch` package.

## 2023-02-08

### 💥 Breaking changes

- All child elements inside app elements and group elements must have `top` and `left` coordinates. To learn more, see [App element children](https://canva.dev/docs/apps/design-interaction/app-element-children/) and [Group elements](https://canva.dev/docs/apps/design-interaction/group-elements/).

### 🧰 Added

- [`getCurrentPageContext`](https://canva.dev/docs/apps/design-interaction/page-context/) method to the [Design Interaction](https://canva.dev/docs/apps/design-interaction/) capability. Apps can use this method to get the dimensions of the current page.
- Properties for positioning elements on the current page. The available properties include `top`, `left`, `width`, `height`, and `rotation`.
- Option for setting the `width` or `height` to `"auto"`. At runtime, Canva replaces `"auto"` with a value that maintains the aspect ratio of the element.
- Introduce `scrollContainer` CSS class which is applied to the outermost `div` of the app.

### 🐞 Fixed

- Added a `NativeSimpleElementWithBox` type to account for the fact that group elements and app elements cannot contain group elements.

## 2023-02-01

### 🧰 Added
- Added a [Content](https://canva.dev/docs/apps/content) capability that lets apps import images from external URLs

### 🔧 Changed

- Improved the type safety of the [Fetch](https://canva.dev/docs/fetch) capability
- Renamed `onSelectDataTableCallback` to `OnSelectDataTableCallback`
- Renamed files to snake case (e.g. `getImageFromUrl.ts` to `get_image_from_url.ts`)
- Formatted (most of) the repo with [Prettier](https://prettier.io/)

### 🐞 Fixed

- Fixed a bug that prevented hot module replacement from working with localhost URLs

## 2022-12-16

### 🧰 Added

- Support for [Hot Module Replacement](https://webpack.js.org/guides/hot-module-replacement/).
- Access to the browser's `localStorage` API
- Additional documentation in the `README.md` file.
- Support for group elements in the Design Interaction capability.
- Support for drag and drop text in the Drag and Drop capability.
- `DraggableText` component in the starter kit.
- 80+ icons from Easel, Canva's design system, in the `assets/icons` directory.
- The following examples to the `examples` directory:
	- drag_and_drop_text
	- native_group_elements
	- signature_verification

### 🔧 Changed

- By default, the development server is served via HTTP. (You can use the `--use-https` flag to enable HTTPS.)
- The environment variables in the `.env` file use a `CANVA_` prefix to avoid namespace collisions.
- The `lockfileVersion` in the `package-lock.json` file has been upgraded from version 1 to 2.
- The `fonts` directory has been moved to `assets/fonts`.
- The images in the `assets` directory have been moved to `assets/images`.

### 🐞 Fixed

- Various bug fixes and improvements.
