import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import {
  Bell,
  CheckCheck,
  Clock3,
  Sparkles,
  UserRoundPlus,
} from "../components/common/icons";
import { theme } from "../styles/theme";

export function SplashScreen() {
  const pulse = useRef(new Animated.Value(1)).current;
  const reveal = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.08,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.timing(reveal, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(orbit, {
          toValue: 1,
          duration: 4400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  }, [orbit, pulse, reveal]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.illustrationStage}>
        <Animated.View
          style={[
            styles.orbitRing,
            {
              transform: [
                {
                  rotate: orbit.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.orbitBadge, styles.orbitBadgeTop]}>
            <Sparkles color={theme.colors.text} size={16} strokeWidth={2.2} />
          </View>
          <View style={[styles.orbitBadge, styles.orbitBadgeRight]}>
            <Clock3 color={theme.colors.text} size={16} strokeWidth={2.2} />
          </View>
          <View style={[styles.orbitBadge, styles.orbitBadgeBottom]}>
            <UserRoundPlus
              color={theme.colors.text}
              size={16}
              strokeWidth={2.2}
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.mark, { transform: [{ scale: pulse }] }]}>
          <View style={styles.markInnerGlow} />
          <Text style={styles.markText}>TA</Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.copyWrap,
          {
            opacity: reveal,
            transform: [
              {
                translateY: reveal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [22, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Tarefas Agora</Text>
        <Text style={styles.subtitle}>
          Uma abertura mais viva para um app dark, roxo e focado em prazos.
        </Text>
        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <CheckCheck color={theme.colors.text} size={14} strokeWidth={2.3} />
            <Text style={styles.infoChipText}>Arraste para concluir</Text>
          </View>
          <View style={styles.infoChip}>
            <Bell color={theme.colors.text} size={14} strokeWidth={2.3} />
            <Text style={styles.infoChipText}>Alertas locais</Text>
          </View>
          <View style={styles.infoChip}>
            <Sparkles color={theme.colors.text} size={14} strokeWidth={2.3} />
            <Text style={styles.infoChipText}>Resumo do dia</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  glowOne: {
    position: "absolute",
    top: 120,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "rgba(125, 56, 255, 0.20)",
  },
  glowTwo: {
    position: "absolute",
    bottom: 120,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(89, 0, 179, 0.14)",
  },
  mark: {
    width: 110,
    height: 110,
    borderRadius: 32,
    backgroundColor: theme.colors.primaryStrong,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    overflow: "hidden",
  },
  illustrationStage: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  orbitRing: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  orbitBadge: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  orbitBadgeTop: {
    top: -8,
    left: 78,
  },
  orbitBadgeRight: {
    top: 76,
    right: -10,
  },
  orbitBadgeBottom: {
    bottom: -8,
    left: 78,
  },
  markInnerGlow: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.whiteOverlay,
  },
  markText: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: "800",
  },
  copyWrap: {
    gap: 8,
    alignItems: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: 38,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 17,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 320,
  },
  infoRow: {
    marginTop: theme.spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
  },
  infoChipText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
