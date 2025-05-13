import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useAppState() {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        switch (nextAppState) {
          case "active":
            console.log("App has come to the foreground");
            break;
          case "background":
            console.log("App has gone to the background");
            break;
          case "inactive":
            console.log("App is transitioning states");
            break;
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
}
