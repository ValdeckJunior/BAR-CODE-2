import { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export function useNetworkState() {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnectedNow = state.isConnected ?? true;
      setIsConnected(isConnectedNow);

      if (!isConnectedNow) {
        console.warn("Network connection lost");
      } else {
        console.log("Network connection restored");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected };
}
