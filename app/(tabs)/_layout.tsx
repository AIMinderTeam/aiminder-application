import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6200ee",
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
          title: "목표관리",
          tabBarLabel: "목표관리",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="checkbox-marked-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}