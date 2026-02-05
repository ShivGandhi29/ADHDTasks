import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import ActiveCard from "../components/active-card";
import InactiveCard from "../components/inactive-card";

export default function History() {
  const [inactiveTasks, setInactiveTasks] = useState<
    { id: string; task: string; durationMinutes: number }[]
  >([]);

  const activeTask = {
    task: "Reply to council email",
    durationMinutes: 10,
  };

  const handleAddToInactive = (task: string, durationMinutes: number) => {
    setInactiveTasks((current) => [
      ...current,
      { id: `${Date.now()}-${current.length}`, task, durationMinutes },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ActiveCard
          task={activeTask.task}
          durationMinutes={activeTask.durationMinutes}
          onAddToInactive={handleAddToInactive}
        />
        {inactiveTasks.length > 0 && (
          <View style={styles.list}>
            {inactiveTasks.map((item) => (
              <InactiveCard
                key={item.id}
                task={item.task}
                durationMinutes={item.durationMinutes}
                onDelete={() => {}}
                onActivate={() => {}}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  content: {
    padding: 24,
    gap: 16,
  },
  list: {
    gap: 12,
  },
});
