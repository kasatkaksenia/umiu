import { createRoot } from "react-dom/client";

/* Ionic: only the core styles (the app has its own design). */
import "@ionic/react/css/core.css";

/* Fonts are bundled so the app also works offline and inside the iOS app. */
import "@fontsource/urbanist/400.css";
import "@fontsource/urbanist/500.css";
import "@fontsource/urbanist/600.css";
import "@fontsource/urbanist/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";

import "./theme/base.css";
import "./theme/layout.css";

import { initIcons } from "./lib/icons";
import App from "./App";

initIcons();
createRoot(document.getElementById("root")!).render(<App />);
