import { Stack } from "expo-router";

export default function CalendarLayout() {
  return (
    <Stack screenOptions={{ animation: "slide_from_right" }}>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="new-schedule" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
