import { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonSplitPane, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";
import { useStore } from "./lib/store";
import { loadPhotos } from "./lib/photos";
import { BottomNav, SideMenu, UndoToast } from "./components/layout";
import { SheetHost, lookOf } from "./sheets/Sheets";
import Train from "./pages/train/Train";
import { ExerciseHistory, ExerciseScreen } from "./pages/train/Exercise";
import Plan from "./pages/train/Plan";
import Food from "./pages/food/Food";
import Cycle from "./pages/cycle/Cycle";
import Profile, { Account } from "./pages/profile/Profile";

// iOS look everywhere (page transitions, alerts), so the web app feels like the future iPhone app.
setupIonicReact({ mode: "ios", swipeBackEnabled: true });

/** Wide screens get a side menu; phones get the floating bottom bar. */
export const WIDE = "(min-width: 900px)";

export default function App() {
  useStore();
  const look = lookOf();
  useEffect(() => {
    document.documentElement.dataset.look = look;
  }, [look]);
  useEffect(() => {
    loadPhotos();
  }, []);
  return (
    <IonApp>
      <IonReactHashRouter>
        <IonSplitPane contentId="main" when={WIDE}>
          <SideMenu />
          {/* Each section keeps its own page history. The tab bar is hidden: BottomNav and SideMenu are the visible navigation. */}
          <div className="ion-page" id="main">
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/train" component={Train} />
                <Route exact path="/train/plan" component={Plan} />
                <Route exact path="/train/ex/:id" component={ExerciseScreen} />
                <Route exact path="/train/ex/:id/history" component={ExerciseHistory} />
                <Route exact path="/food/:sub?" component={Food} />
                <Route exact path="/cycle" component={Cycle} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/profile/account" component={Account} />
                <Route exact path="/"><Redirect to="/train" /></Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom" className="hidden-tabbar">
                <IonTabButton tab="train" href="/train" />
                <IonTabButton tab="food" href="/food/log" />
                <IonTabButton tab="cycle" href="/cycle" />
              </IonTabBar>
            </IonTabs>
          </div>
        </IonSplitPane>
        <BottomNav />
        <SheetHost />
        <UndoToast />
      </IonReactHashRouter>
    </IonApp>
  );
}
