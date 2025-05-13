// TODO: Convert this to functional component

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error("Error caught by boundary:", error);
      console.error("Component stack:", errorInfo.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    router.replace("/(tabs)");
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>An Error Occurred</Text>
          <Text style={styles.message}>
            The app encountered an unexpected error. Please try again.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.light.textInverted,
    fontFamily: "Inter-Bold",
    fontSize: 16,
  },
});
