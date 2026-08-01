import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/common/AppHeader";
import { Sparkles } from "../components/common/icons";
import { PremiumPanel } from "../components/common/PremiumPanel";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { theme } from "../styles/theme";

export function HomeScreen({
  completedCount,
  pendingCount,
  overdueCount,
  completedToday,
  dailyGoal,
  onOpenTasks,
}) {
  const intro = useRef(new Animated.Value(0)).current;
  const totalTasks = completedCount + pendingCount;
  const progressPercent = dailyGoal
    ? Math.min(100, Math.round((completedToday / dailyGoal) * 100))
    : totalTasks
      ? Math.round((completedCount / totalTasks) * 100)
      : 0;
  const reportMessage = overdueCount
    ? `${overdueCount} tarefa(s) atrasada(s) exigem atenção agora.`
    : dailyGoal
      ? `${completedToday} de ${dailyGoal} concluídas hoje.`
      : `${completedCount} concluídas de ${totalTasks} no total.`;
  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [intro]);

  return (
    <ScreenContainer>
      <AppHeader eyebrow="Home" title="Resumo do dia" />

      <Animated.View
        style={[
          styles.reportWrap,
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
        <PremiumPanel style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.reportTitleRow}>
              <Sparkles
                color={theme.colors.primary}
                size={21}
                strokeWidth={2.2}
              />
              <Text style={styles.reportTitle}>Resumo do dia</Text>
            </View>
            {overdueCount ? (
              <Text style={styles.warningPill}>Atrasadas</Text>
            ) : null}
          </View>

          <Text style={styles.reportLead}>{reportMessage}</Text>

          <View style={styles.premiumStrip}>
            <Text style={styles.premiumStripLabel}>Foco do dia</Text>
            <Text style={styles.premiumStripText}>
              Acompanhe seu ritmo diário aqui e use a aba de tarefas para criar,
              editar e revisar toda a lista.
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(progressPercent, dailyGoal || totalTasks ? 8 : 0)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLegend}>
            {dailyGoal
              ? `${completedToday} concluídas hoje · meta de ${dailyGoal}`
              : `${pendingCount} pendentes · ${completedCount} concluídas`}
          </Text>

          <View style={styles.reportGrid}>
            <View style={styles.reportMetricCard}>
              <Text style={styles.reportMetricLabel}>Hoje</Text>
              <Text style={styles.reportMetricValue}>{completedToday}</Text>
            </View>
            <View style={styles.reportMetricCard}>
              <Text style={styles.reportMetricLabel}>Pendentes</Text>
              <Text style={styles.reportMetricValue}>{pendingCount}</Text>
            </View>
            <View style={styles.reportMetricCard}>
              <Text style={styles.reportMetricLabel}>Em atraso</Text>
              <Text style={styles.reportMetricValue}>{overdueCount}</Text>
            </View>
          </View>
        </PremiumPanel>
      </Animated.View>

      <Pressable style={styles.openTasksButton} onPress={onOpenTasks}>
        <Text style={styles.openTasksButtonText}>Abrir tarefas</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  reportWrap: {
    borderRadius: theme.radius.lg,
  },
  reportCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: 12,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  reportTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  warningPill: {
    color: theme.colors.warning,
    fontSize: 12,
    fontWeight: "800",
    backgroundColor: "rgba(255, 177, 85, 0.12)",
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
  },
  reportLead: {
    color: theme.colors.textMuted,
    fontSize: 17,
    lineHeight: 26,
  },
  premiumStrip: {
    gap: 4,
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  premiumStripLabel: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  premiumStripText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  progressTrack: {
    width: "100%",
    height: 12,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceStrong,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryStrong,
  },
  progressLegend: {
    color: theme.colors.textSoft,
    fontSize: 14,
  },
  reportGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  reportMetricCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceStrong,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    gap: 8,
  },
  reportMetricLabel: {
    color: theme.colors.textSoft,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  reportMetricValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  openTasksButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
  },
  openTasksButtonText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
});
