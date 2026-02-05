import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import IconSymbol from "../components/ui/icon-symbol";

export default function TabLayout() {
  if (Platform.OS === "ios") {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="home">
          <Label>Now</Label>
          <Icon sf="house.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="newTask" role="search">
          <Label>Add</Label>
          <Icon sf="plus" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="history">
          <Label>History</Label>
          <Icon sf="paperplane.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Label>Settings</Label>
          <Icon sf="gear" />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Now",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house.fill" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="newTask"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="plus" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="paperplane.fill" color={color} size={size} />
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
