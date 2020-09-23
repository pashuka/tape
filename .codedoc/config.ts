import { configuration } from "@codedoc/core";

import { theme } from "./theme";

export const config = /*#__PURE__*/ configuration({
  theme, // --> add the theme. modify `./theme.ts` for chaning the theme.
  dest: {
    // @see /docs/config/output
    html: "docs/build", // --> the base folder for HTML files
    assets: "docs/build", // --> the base folder for assets    bundle: "docs/assets", // --> where to store codedoc's bundle (relative to `assets`)
    styles: "docs/assets", // --> where to store codedoc's styles (relative to `assets`)
    namespace: "", // --> project namespace
  },
  page: {
    title: {
      base: "Tape", // --> the base title of your doc pages
    },
    favicon: "/docs/favicon.ico?2",
  },
});
