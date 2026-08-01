import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppHeader } from "../components/common/AppHeader";
import { EmptyStatePanel } from "../components/common/EmptyStatePanel";
import { Save } from "../components/common/icons";
import { PremiumPanel } from "../components/common/PremiumPanel";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { theme } from "../styles/theme";

export function ProfileScreen({
  profile,
  hasAccount,
  totalTasks,
  completedCount,
  pendingCount,
  overdueCount,
  completedToday,
  dailyGoal,
  completionHistory,
  onChangeField,
  onSave,
  onLogout,
}) {
  const intro = useRef(new Animated.Value(0)).current;
  const [editingVisible, setEditingVisible] = useState(false);
  const statAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      65,
      statAnimations.map((animation) =>
        Animated.spring(animation, {
          toValue: 1,
          useNativeDriver: true,
          speed: 16,
          bounciness: 7,
        }),
      ),
    ).start();
  }, [intro, statAnimations]);

  const initials = profile.name.trim()
    ? profile.name
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("")
    : "TA";
  const goalProgress = dailyGoal
    ? Math.min(100, Math.round((completedToday / dailyGoal) * 100))
    : 0;

  return (
    <ScreenContainer>
      <AppHeader
        eyebrow="Perfil"
        title={hasAccount ? "Sua conta" : "Criar conta"}
      />

      {hasAccount ? (
        <Animated.View
          style={[
            styles.profileWrap,
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
          <PremiumPanel
            style={styles.profileCard}
            bottomGlowColor={theme.colors.goldSoft}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileCopy}>
              <Text style={styles.name}>
                {profile.name || "Sem conta criada"}
              </Text>
              <Text style={styles.role}>
                {profile.role || "Preencha seus dados para ativar a conta."}
              </Text>
            </View>
          </PremiumPanel>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.profileWrap,
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
          <EmptyStatePanel
            eyebrow="Conta local"
            title="Seu perfil começa aqui"
            description="Crie sua conta para personalizar foco, meta diária e acompanhar sua consistência com identidade visual própria."
          />
        </Animated.View>
      )}

      <PremiumPanel
        style={styles.activityCard}
        bottomGlowColor={theme.colors.goldSoft}
      >
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>Atividade</Text>
          <Pressable
            style={styles.editButton}
            onPress={() => setEditingVisible(true)}
          >
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </Pressable>
        </View>

        <View style={styles.profileDetailBanner}>
          <Text style={styles.profileDetailLabel}>Painel pessoal</Text>
          <Text style={styles.profileDetailText}>
            Ajuste seu foco, acompanhe sua meta diária e mantenha uma leitura
            clara do seu desempenho.
          </Text>
        </View>

        <View style={styles.dailySummaryCard}>
          <Text style={styles.dailySummaryLabel}>Concluídas hoje</Text>
          <Text style={styles.dailySummaryValue}>{completedToday}</Text>
          <Text style={styles.dailySummaryText}>
            {dailyGoal
              ? `${completedToday} de ${dailyGoal} tarefas da meta diária.`
              : "Defina uma meta diária para acompanhar seu ritmo."}
          </Text>
          <View style={styles.goalTrack}>
            <View
              style={[
                styles.goalFill,
                { width: `${Math.max(goalProgress, dailyGoal ? 8 : 0)}%` },
              ]}
            />
          </View>

          <View style={styles.historyWrap}>
            <Text style={styles.historyTitle}>
              Histórico dos últimos 7 dias
            </Text>
            <View style={styles.historyChart}>
              {completionHistory.map((item) => {
                const peak = Math.max(
                  1,
                  ...completionHistory.map((historyItem) => historyItem.count),
                );
                const barHeight = item.count
                  ? Math.max(16, (item.count / peak) * 64)
                  : 8;

                return (
                  <View key={item.key} style={styles.historyColumn}>
                    <Text style={styles.historyCount}>{item.count}</Text>
                    <View style={styles.historyTrack}>
                      <View
                        style={[styles.historyBar, { height: barHeight }]}
                      />
                    </View>
                    <Text style={styles.historyLabel}>{item.label}</Text>
                    <Text style={styles.historyDate}>{item.fullLabel}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </PremiumPanel>

      <View style={styles.statsRow}>
        <AnimatedStatCard
          label="Total"
          value={totalTasks}
          animation={statAnimations[0]}
        />
        <AnimatedStatCard
          label="Pendentes"
          value={pendingCount}
          animation={statAnimations[1]}
        />
        <AnimatedStatCard
          label="Alertas"
          value={overdueCount}
          animation={statAnimations[2]}
        />
        <AnimatedStatCard
          label="Concluídas"
          value={completedCount}
          animation={statAnimations[3]}
        />
      </View>

      <Pressable style={styles.logoutButtonFull} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Sair da conta</Text>
      </Pressable>

      <Modal
        visible={editingVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setEditingVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setEditingVisible(false)}
          />

          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar perfil</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(value) => onChangeField("name", value)}
                placeholder="Seu nome"
                placeholderTextColor={theme.colors.textSoft}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(value) => onChangeField("email", value)}
                placeholder="voce@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.textSoft}
              />
            </View>

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
                placeholder="Ex.: Organizar rotina, prazos e metas"
                placeholderTextColor={theme.colors.textSoft}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Meta diária de tarefas</Text>
              <TextInput
                style={styles.input}
                value={profile.dailyGoal}
                onChangeText={(value) => onChangeField("dailyGoal", value)}
                placeholder="Ex.: 6"
                keyboardType="number-pad"
                placeholderTextColor={theme.colors.textSoft}
              />
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setEditingVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={async () => {
                  const saved = await onSave();

                  if (saved) {
                    setEditingVisible(false);
                  }
                }}
              >
                <Save color={theme.colors.text} size={20} strokeWidth={2.3} />
                <Text style={styles.saveButtonText}>Salvar perfil</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileWrap: {
    borderRadius: theme.radius.lg,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    position: "relative",
    overflow: "hidden",
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: theme.colors.primaryStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  profileCopy: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  role: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  activityCard: {
    backgroundColor: theme.colors.surfaceStrong,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 23,
    fontWeight: "800",
  },
  editButton: {
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  profileDetailBanner: {
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  profileDetailLabel: {
    color: theme.colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  profileDetailText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  fieldGroup: {
    gap: 10,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  input: {
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: theme.colors.text,
    fontSize: 17,
  },
  textarea: {
    minHeight: 108,
  },
  dailySummaryCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 10,
  },
  dailySummaryLabel: {
    color: theme.colors.textSoft,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  dailySummaryValue: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: "800",
  },
  dailySummaryText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  goalTrack: {
    width: "100%",
    height: 12,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceSoft,
    overflow: "hidden",
  },
  goalFill: {
    height: "100%",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryStrong,
  },
  historyWrap: {
    gap: 10,
  },
  historyTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  historyChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  historyColumn: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  historyCount: {
    color: theme.colors.textSoft,
    fontSize: 13,
    fontWeight: "700",
  },
  historyTrack: {
    width: "100%",
    height: 72,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: theme.radius.md,
    paddingBottom: 8,
  },
  historyBar: {
    width: 20,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryStrong,
  },
  historyLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  historyDate: {
    color: theme.colors.textSoft,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    paddingVertical: 16,
    backgroundColor: theme.colors.surfaceUltra,
  },
  cancelButtonText: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButtonFull: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    paddingVertical: 16,
    backgroundColor: theme.colors.surfaceUltra,
  },
  logoutButtonText: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: theme.colors.primaryStrong,
    borderRadius: theme.radius.pill,
    paddingVertical: 16,
  },
  saveButtonText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: 8,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  statLabel: {
    color: theme.colors.textSoft,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "center",
    padding: theme.spacing.md,
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
});

function AnimatedStatCard({ label, value, animation }) {
  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Animated.View>
  );
}
