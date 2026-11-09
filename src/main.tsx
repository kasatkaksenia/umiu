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
/* Fonts of the extra looks: the browser only downloads a file when a look uses it. */
import "@fontsource/inter-tight/300.css";
import "@fontsource/inter-tight/400.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "@fontsource/inter-tight/700.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/doto/800.css";
import "@fontsource/silkscreen/400.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";

import "./theme/base.css";
import "./theme/layout.css";
import "./theme/looks.css";

import { initIcons } from "./lib/icons";
import App from "./App";

initIcons();
createRoot(document.getElementById("root")!).render(<App />);
