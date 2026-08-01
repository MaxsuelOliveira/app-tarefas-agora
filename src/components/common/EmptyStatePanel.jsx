import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../styles/theme";
import { Clock3, Sparkles } from "./icons";
import { PremiumPanel } from "./PremiumPanel";

export function EmptyStatePanel({ eyebrow, title, description }) {
  return (
    <PremiumPanel style={styles.card}>
      <View style={styles.illustrationWrap}>
        <View style={styles.orbMain}>
          <Clock3 color={theme.colors.text} size={28} strokeWidth={2.2} />
        </View>
        <View style={styles.orbAccent}>
          <Sparkles color={theme.colors.text} size={16} strokeWidth={2.2} />
        </View>
        <View style={styles.line} />
        <View style={styles.dot} />
      </View>

      <View style={styles.copyWrap}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </PremiumPanel>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceStrong,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  illustrationWrap: {
    height: 118,
    alignItems: "center",
    justifyContent: "center",
  },
  orbMain: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryStrong,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  orbAccent: {
    position: "absolute",
    top: 18,
    right: 82,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.gold,
  },
  line: {
    position: "absolute",
    bottom: 18,
    width: 110,
    height: 1,
    backgroundColor: theme.colors.borderStrong,
  },
  dot: {
    position: "absolute",
    bottom: 14,
    right: 84,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
  },
  copyWrap: {
    gap: 6,
    alignItems: "center",
  },
  eyebrow: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },
});
