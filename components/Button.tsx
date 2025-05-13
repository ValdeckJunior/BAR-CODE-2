import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function CustomButton({
  text,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: disabled
            ? Colors.light.primaryLight
            : Colors.light.primary,
        };
      case "secondary":
        return {
          backgroundColor: Colors.light.surface,
          borderWidth: 1,
          borderColor: Colors.light.border,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: Colors.light.primary,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
      case "medium":
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
      case "large":
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return {
          color: Colors.light.textInverted,
        };
      case "secondary":
        return {
          color: Colors.light.text,
        };
      case "outline":
      case "ghost":
        return {
          color: Colors.light.primary,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            color={
              variant === "primary"
                ? Colors.light.textInverted
                : Colors.light.primary
            }
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text
              style={[
                styles.text,
                getTextStyle(),
                disabled && styles.textDisabled,
              ]}
            >
              {text}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    textAlign: "center",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.6,
  },
  textDisabled: {
    opacity: 0.8,
  },
  iconContainer: {
    marginRight: 8,
  },
});
