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
import { format } from "date-fns/format";

interface ScanLog {
  id: string;
  timestamp: string;
  type: "scanned" | "was_scanned";
  targetId: string;
  targetName: string;
}

export default function LogsScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group logs by date
  const groupedLogs = logs.reduce((groups, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
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
          {format(new Date(item.timestamp), "HH:mm")}
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
