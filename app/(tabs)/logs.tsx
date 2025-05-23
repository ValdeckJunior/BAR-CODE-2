import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Theme } from "@/constants/Theme";

interface ScanLog {
  id: string;
  timestamp: string;
  type: "scanned" | "was_scanned";
  targetId: string;
  targetName: string;
}

// Mock data for development
const mockLogs: ScanLog[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    type: "scanned",
    targetId: "STU123",
    targetName: "John Doe",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    type: "was_scanned",
    targetId: "LEC456",
    targetName: "Dr. Smith",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: "scanned",
    targetId: "STU789",
    targetName: "Jane Smith",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: "was_scanned",
    targetId: "LEC101",
    targetName: "Prof. Johnson",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    type: "scanned",
    targetId: "STU202",
    targetName: "Alice Brown",
  },
];

// Simple date formatting function
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Format date for grouping
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function LogsScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadLogs = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLogs(mockLogs);
        setLoading(false);
      } catch (err) {
        setError("Failed to load logs");
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  // Group logs by date
  const groupedLogs = logs.reduce((groups, log) => {
    const date = formatDate(log.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, ScanLog[]>);

  const renderLogItem = ({ item }: { item: ScanLog }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <ThemedText style={styles.logType}>
          {item.type === "scanned" ? "Scanned" : "Was Scanned By"}
        </ThemedText>
        <ThemedText style={styles.logTime}>
          {formatTime(item.timestamp)}
        </ThemedText>
      </View>
      <ThemedText style={styles.logTarget}>
        {item.targetName} ({item.targetId})
      </ThemedText>
    </View>
  );

  const renderDateGroup = ({ item }: { item: string }) => (
    <View style={styles.dateGroup}>
      <ThemedText style={styles.dateHeader}>{item}</ThemedText>
      {groupedLogs[item].map((log) => (
        <View key={log.id}>{renderLogItem({ item: log })}</View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={Object.keys(groupedLogs)}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>No scan logs found</ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: Theme.spacing.md,
  },
  dateGroup: {
    marginBottom: Theme.spacing.lg,
  },
  dateHeader: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.lg,
    color: Colors.light.primary,
    marginBottom: Theme.spacing.sm,
  },
  logItem: {
    backgroundColor: Colors.light.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    marginBottom: Theme.spacing.sm,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.xs,
  },
  logType: {
    fontFamily: Theme.fontFamily.bold,
    fontSize: Theme.fontSize.md,
    color: Colors.light.text,
  },
  logTime: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  logTarget: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.light.textSecondary,
  },
  errorText: {
    color: Colors.light.error,
    textAlign: "center",
    margin: Theme.spacing.lg,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.xl,
  },
});
