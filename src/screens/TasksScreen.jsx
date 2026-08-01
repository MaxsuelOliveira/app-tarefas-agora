import { useMemo } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppHeader } from "../components/common/AppHeader";
import { EmptyStatePanel } from "../components/common/EmptyStatePanel";
import { Plus } from "../components/common/icons";
import { PremiumPanel } from "../components/common/PremiumPanel";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { TaskCard } from "../components/task/TaskCard";
import { TaskForm } from "../components/task/TaskForm";
import { theme } from "../styles/theme";

export function TasksScreen({
  tasks,
  editingTaskId,
  composerVisible,
  form,
  onFormChange,
  onSubmitTask,
  onOpenComposer,
  onCloseComposer,
  onEditTask,
  onToggleTask,
  onRemoveTask,
}) {
  const orderedTasks = useMemo(
    () =>
      [...tasks].sort(
        (left, right) =>
          new Date(right.createdAt || 0).getTime() -
          new Date(left.createdAt || 0).getTime(),
      ),
    [tasks],
  );

  async function handleSubmit() {
    const created = await onSubmitTask();

    if (!created) {
      Alert.alert("Título obrigatório", "Digite um título para a tarefa.");
    }
  }

  return (
    <ScreenContainer>
      <AppHeader eyebrow="Tarefas" title="Todas as tarefas" />

      <PremiumPanel
        style={styles.heroCard}
        bottomGlowColor={theme.colors.goldSoft}
      >
        <Text style={styles.heroTitle}>
          Organize, edite e acompanhe tudo em um só lugar.
        </Text>
        <Text style={styles.heroText}>
          Esta tela concentra a criação e a lista completa das tarefas para
          manter a Home limpa.
        </Text>

        <Pressable style={styles.heroButton} onPress={onOpenComposer}>
          <Plus color={theme.colors.text} size={18} strokeWidth={2.4} />
          <Text style={styles.heroButtonText}>Nova tarefa</Text>
        </Pressable>
      </PremiumPanel>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Lista completa</Text>
        <Text style={styles.sectionText}>
          Toque em editar para abrir o formulário em modal e manter o contexto
          da lista.
        </Text>

        {!orderedTasks.length ? (
          <EmptyStatePanel
            eyebrow="Sem tarefas"
            title="Nenhuma tarefa criada"
            description="Abra o modal para cadastrar sua primeira tarefa e começar a estruturar o fluxo do dia."
          />
        ) : null}

        {orderedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onRemove={onRemoveTask}
          />
        ))}
      </View>

      <Modal
        visible={composerVisible}
        animationType="fade"
        transparent
        onRequestClose={onCloseComposer}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onCloseComposer}
          />
          <View style={styles.modalCard}>
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <TaskForm
                form={form}
                editing={Boolean(editingTaskId)}
                onChange={onFormChange}
                onSubmit={handleSubmit}
                onCancelEditing={onCloseComposer}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: 12,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 30,
  },
  heroText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: theme.colors.primaryStrong,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
  },
  heroButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  listSection: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  sectionText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "center",
    padding: theme.spacing.md,
  },
  modalCard: {
    maxHeight: "88%",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
