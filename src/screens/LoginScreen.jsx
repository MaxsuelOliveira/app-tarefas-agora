import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { theme } from "../styles/theme";

export function LoginScreen({ profile, onChangeField, onSubmit }) {
  const intro = useRef(new Animated.Value(0)).current;
  const [mode, setMode] = useState("login");
  const isLoginMode = mode === "login";
  const isCreateMode = mode === "create";

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [intro]);

  return (
    <ScreenContainer contentContainerStyle={styles.screenContent}>
      <View style={styles.screenCenter}>
        <View style={styles.glowOrbPrimary} />
        <View style={styles.glowOrbAccent} />

        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: intro,
              transform: [
                {
                  translateY: intro.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.eyebrow}>Acesso local</Text>
          <Text style={styles.title}>
            {isLoginMode ? "Entrar" : "Criar conta"}
          </Text>
          <Text style={styles.subtitle}>
            {isLoginMode
              ? "Use nome e e-mail para acessar seu espaço local."
              : "Preencha os dados essenciais para montar seu espaço de tarefas."}
          </Text>

          <View style={styles.switchWrap}>
            <Pressable
              style={[
                styles.entryButton,
                isLoginMode && styles.entryButtonActive,
              ]}
              onPress={() => setMode("login")}
            >
              <Text
                style={[
                  styles.entryButtonText,
                  isLoginMode && styles.entryButtonTextActive,
                ]}
              >
                Login
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.entryButton,
                isCreateMode && styles.entryButtonActive,
              ]}
              onPress={() => setMode("create")}
            >
              <Text
                style={[
                  styles.entryButtonText,
                  isCreateMode && styles.entryButtonTextActive,
                ]}
              >
                Criar conta
              </Text>
            </Pressable>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(value) => onChangeField("name", value)}
                placeholder="Seu nome completo"
                placeholderTextColor={theme.colors.textSoft}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(value) => onChangeField("email", value)}
                placeholder="voce@email.com"
                placeholderTextColor={theme.colors.textSoft}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {isCreateMode ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Papel</Text>
                  <TextInput
                    style={styles.input}
                    value={profile.role}
                    onChangeText={(value) => onChangeField("role", value)}
                    placeholder="Ex.: Produtividade pessoal"
                    placeholderTextColor={theme.colors.textSoft}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Foco atual</Text>
                  <TextInput
                    style={[styles.input, styles.textarea]}
                    value={profile.focus}
                    onChangeText={(value) => onChangeField("focus", value)}
                    placeholder="Ex.: Organizar rotina, prazos e prioridades"
                    placeholderTextColor={theme.colors.textSoft}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </>
            ) : null}

            <Pressable style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitButtonText}>
                {isLoginMode ? "Entrar no app" : "Criar conta e entrar"}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: theme.spacing.xl,
  },
  screenCenter: {
    width: "100%",
    alignSelf: "center",
    position: "relative",
    maxWidth: 480,
  },
  glowOrbPrimary: {
    position: "absolute",
    top: -18,
    right: 8,
    width: 120,
    height: 120,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(125, 56, 255, 0.22)",
  },
  glowOrbAccent: {
    position: "absolute",
    bottom: -12,
    left: 10,
    width: 92,
    height: 92,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(88, 213, 255, 0.12)",
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.6,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  switchWrap: {
    flexDirection: "row",
    gap: 8,
    padding: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 4,
  },
  entryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: theme.radius.pill,
    backgroundColor: "transparent",
  },
  entryButtonActive: {
    backgroundColor: theme.colors.primaryStrong,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  entryButtonText: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "800",
  },
  entryButtonTextActive: {
    color: theme.colors.text,
  },
  formCard: {
    gap: 12,
    marginTop: 4,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: theme.colors.text,
    fontSize: 15,
  },
  textarea: {
    minHeight: 96,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryStrong,
    borderRadius: theme.radius.pill,
    paddingVertical: 15,
    marginTop: 6,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  submitButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
});
