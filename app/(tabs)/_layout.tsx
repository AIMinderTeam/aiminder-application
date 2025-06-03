import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4395E6",
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tabs.Screen
        name="(calendar)/index"
        options={{
          title: "캘린더",
          tabBarLabel: "캘린더",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(timetable)/index"
        options={{
          title: "타임테이블",
          tabBarLabel: "타임테이블",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="timetable" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(goals)/index"
        options={{
          title: "AI비서",
          tabBarLabel: "AI비서",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="robot-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}