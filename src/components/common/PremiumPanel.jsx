import { StyleSheet, View } from "react-native";
import { theme } from "../../styles/theme";

export function PremiumPanel({
  children,
  style,
  topGlowColor = theme.colors.primaryGlow,
  bottomGlowColor = theme.colors.accentSoft,
}) {
  return (
    <View style={[styles.panel, style]}>
      <View
        style={[styles.glow, styles.glowTop, { backgroundColor: topGlowColor }]}
      />
      <View
        style={[
          styles.glow,
          styles.glowBottom,
          { backgroundColor: bottomGlowColor },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    borderRadius: theme.radius.pill,
  },
  glowTop: {
    top: -36,
    right: -12,
    width: 120,
    height: 120,
  },
  glowBottom: {
    bottom: -42,
    left: -20,
    width: 100,
    height: 100,
  },
});
