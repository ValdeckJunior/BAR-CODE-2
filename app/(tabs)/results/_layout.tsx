import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function ResultsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.primary,
        },
        headerTintColor: "#fff",
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
        name="[id]/index"
        options={{
          headerTitle: "Course Details",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
