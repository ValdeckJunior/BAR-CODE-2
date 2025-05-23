import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { loginUser, restoreAuthState } from "@/store/slices/authSlice";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import ScanScreen from "./(tabs)/scan";

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Try to restore auth state when app loads
    dispatch(restoreAuthState())
      .unwrap()
      .then(() => {
        router.replace("/(tabs)");
      })
      .catch(() => {
        // No stored auth state, user needs to log in
      });
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ matricule, password })).unwrap();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Invalid credentials"
      );
    }
  };

  const user = useSelector((state: RootState) => state.auth.user);
  // If user is a lecturer/invigilator, show only ScanScreen
  if (user && user.role && user.role.toUpperCase().includes("LECTURER")) {
    return <ScanScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/qr-campus-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View>
        <Text style={styles.title}>Login to your account</Text>
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Matricule (e.g., FE20A001)"
            style={styles.input}
            value={matricule}
            onChangeText={setMatricule}
            autoCapitalize="none"
            editable={!loading}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <IconSymbol
                name={showPassword ? "eye.slash" : "eye"}
                size={24}
                color={Colors.light.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.light.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.light.textInverted} />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>
          Test Account: FE20A001 / password123
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 35,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  logo: {
    width: "80%",
    height: "100%",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 15,
    color: Colors.light.text,
  },
  inputGroup: {
    gap: 10,
  },
  input: {
    height: 50,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    fontFamily: "Inter-Regular",
  },
  button: {
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.light.textInverted,
    fontFamily: "Inter-Bold",
    fontSize: 16,
  },
  errorText: {
    color: Colors.light.error,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  helpContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  helpText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  visibilityToggle: {
    position: "absolute",
    right: 12,
    top: 13,
    padding: 5,
  },
});
