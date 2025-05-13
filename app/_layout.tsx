import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "@/store";
import { Colors } from "@/constants/Colors";
import { restoreAuthState } from "@/store/slices/authSlice";
import { restoreCourses } from "@/store/slices/courseSlice";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { revalidation } from "@/utils/revalidation";
import { useAppState } from "@/hooks/useAppState";
import { NetworkStatus } from "@/components/NetworkStatus";
import { View } from "react-native";

function RootLayoutContent() {
  const dispatch = useDispatch<AppDispatch>();

  // Initialize app state monitoring
  useAppState();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Restore both auth and course states when app starts
        await Promise.all([
          dispatch(restoreAuthState()),
          dispatch(restoreCourses()),
        ]);

        // Revalidate data after state restoration
        const result = await revalidation.revalidateAllData();

        if (!result.success) {
          console.error("Data revalidation failed:", result.error);
        }
      } catch (error) {
        console.error("App initialization failed:", error);
      }
    };

    initializeApp();
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <NetworkStatus />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.light.primary,
          },
          headerTintColor: Colors.light.textInverted,
          headerTitleStyle: {
            fontFamily: "Inter-Bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.otf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.otf"),
    "Inter-Italic": require("../assets/fonts/Inter-Italic.otf"),
    "Inter-Bold-Italic": require("../assets/fonts/Inter-Bold-Italic.otf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RootLayoutContent />
      </Provider>
    </ErrorBoundary>
  );
}
