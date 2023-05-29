# Canva API beta starter kit

Welcome to the **beta starter kit** for Canva's app development platform. 🎉

This repo contains everything you need to get an app up and running in a matter of minutes, including a boilerplate project and lots of examples. The complete documentation for the platform is at [canva.dev/docs/apps](https://www.canva.dev/docs/apps/).

**Note:** The starter kit and documentation assumes some experience with TypeScript and React.

## Requirements

- Node.js 14.18.1 or higher

**Note:** To make sure you're running the correct version of Node.js, we recommend using a version manager, such as [nvm](https://github.com/nvm-sh/nvm#intro). The .nvmrc file in the root directory of this repo will ensure the correct version is used.

## Quick start

```bash
git clone git@github.com:canva-sdks/canva-api-starter-kit-beta.git
cd canva-api-starter-kit-beta
npm install
```

## Using the boilerplate

### Step 1: Start the local development server

The `src` directory contains the boilerplate of an app.

To start the boilerplate's development server, run the following command:

```bash
npm start
```

The server becomes available at http://localhost:8080.

The app's source code is in the `src/app.tsx` file.

### Step 2: Preview the app

The local development server only exposes a JavaScript bundle, so you can't preview an app by visiting http://localhost:8080. You can only preview an app via the Canva editor.

To preview an app:

1. Create an app via the [Developer Portal](https://www.canva.com/developers).
2. Select **Extension source > Development URL**.
3. In the **Development URL** field, enter the URL of the development server.
4. Click **Preview**. This opens the Canva editor (and the app) in a new tab.
5. Click **Use**. (This screen only appears when when using an app for the first time.)

A "Hello world" example appears in the side panel.

### (Optional) Step 3: Enable Hot Module Replacement

By default, every time you make a change to an app, you have to reload the entire app to see the results of those changes. If you enable [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) (HMR), changes will be reflected without a full reload, which significantly speeds up the development loop.

**Note:** Enabling HMR when running within a docker container is currently **not** supported.

To enable HMR:

1. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
2. Copy the ID of an app from the **App ID** column.
3. In the starter kit's `.env` file, set the `CANVA_HMR_ENABLED` environment variable to `TRUE` and `CANVA_APP_ID` to the ID of the app:

   ```bash
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_PORT=3001
   CANVA_APP_ID=#<APP_ID_GOES_HERE>
   CANVA_HMR_ENABLED=FALSE
   ```

   For example:

   ```bash
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_PORT=3001
   CANVA_APP_ID=AABBccddeeff
   CANVA_HMR_ENABLED=TRUE
   ```

4. Restart the local server.

## Previewing apps in Safari

By default, the development server is not HTTPS-enabled. This is convenient, as there's no need for a security certificate, but it prevents apps from being previewed in Safari.

<details>
  <summary>Why Safari requires the development server to be HTTPS-enabled</summary>

Canva itself is served via HTTPS and most browsers prevent HTTPS pages from loading scripts via non-HTTPS connections. Chrome and Firefox make exceptions for local servers, such as `localhost`, but Safari does not, so if you're using Safari, the development server must be HTTPS-enabled.

To learn more, see [Loading mixed-content resources](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#loading_mixed-content_resources).

</details>

To preview apps in Safari:

1. Start the development server with HTTPS enabled:

   ```bash
   # Run the main app
   npm start --use-https

   # Run an example
   npm start <example-name> --use-https
   ```

2. Navigate to <https://localhost:8080>.
3. Bypass the invalid security certificate warning:
   1. Click **Show details**.
   2. Click **Visit website**.
4. In the Developer Portal, set the app's **Development URL** to <https://localhost:8080>.

You need to bypass the invalid security certificate warning every time you start the local server. A similar warning will appear in other browsers (and will need to be bypassed) whenever HTTPS is enabled.

## Running the examples

The `examples` directory contains example apps that demonstrate the available APIs.

To start an example's development server, run the following command:

```bash
npm start <example-name>
```

But replace `<example-name>` with the name of an example, like so:

```bash
npm start native_image_elements
```

Like the boilerplate, a development server becomes available at http://localhost:8080.

### Running an example's backend / Browser Fetch

Some examples have a backend. This backend is defined in the example's `backend/server.ts` file, automatically starts when the `npm start` command is run, and becomes available at http://localhost:3001.

To enable the backend examples:

1. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
2. Copy the ID of an app from the **App ID** column.
3. In the starter kit's `.env` file, `CANVA_APP_ID` to the ID of the app:

   ```bash
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_PORT=3001
   CANVA_APP_ID=#<APP_ID_GOES_HERE>
   CANVA_HMR_ENABLED=FALSE
   ```

   For example:

   ```bash
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_PORT=3001
   CANVA_APP_ID=AABBccddeeff
   CANVA_HMR_ENABLED=FALSE
   ```

4. Start the example:

   ```bash
   npm start fetch
   ```

## Using icons

The `icons` directory contains a number of icons from Easel, Canva's design system. You can use these icons in your app to ensure that it has a consistent look and feel with the core Canva experience.

To use an icon, import it:

```tsx
import AlignTextLeft from "assets/icons/align-text-left.svg";
```

Then use it like any other React component:

```tsx
<AlignTextLeft />
```

The icon components accept a `size` prop, which can be set to any of the following values:

- `"tiny"`
- `"small"`
- `"medium"`
- `"large"`

The default value is `"medium"`.
