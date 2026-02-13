import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import IconSymbol from "../components/ui/icon-symbol";

export default function TabLayout() {
  if (Platform.OS === "ios") {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="newTask" role="search">
          <Label>Add</Label>
          <Icon sf="plus" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="home">
          <Label>Focusd</Label>
          <Icon sf="bolt.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="toDoList">
          <Label>Tasks</Label>
          <Icon sf="list.bullet" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="history">
          <Label>History</Label>
          <Icon sf="clock.arrow.circlepath" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Label>Settings</Label>
          <Icon sf="gear" />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Focusd",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="bolt.fill" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="newTask"
        options={{
          title: "Add Task",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="plus" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="toDoList"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="list.bullet" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol
              name="clock.arrow.circlepath"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="gearshape" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
