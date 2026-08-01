import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../styles/theme";
import { ChevronRight } from "./icons";

export function AppHeader({ eyebrow, title, actionLabel, onActionPress }) {
  return (
    <View style={styles.header}>
      <View style={styles.copyWrap}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>

      {actionLabel && onActionPress ? (
        <Pressable style={styles.actionButton} onPress={onActionPress}>
          <ChevronRight
            color={theme.colors.text}
            size={18}
            strokeWidth={2.25}
          />
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginBottom: 2,
  },
  copyWrap: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 31,
    fontWeight: "800",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    paddingHorizontal: 16,
    paddingVertical: 11,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  actionText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
});
