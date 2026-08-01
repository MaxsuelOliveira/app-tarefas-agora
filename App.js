import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ClipboardList, House, UserRound } from "./src/components/common/icons";
import { useAppReady } from "./src/hooks/useAppReady";
import { useProfile } from "./src/hooks/useProfile";
import { useTasks } from "./src/hooks/useTasks";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
import { TasksScreen } from "./src/screens/TasksScreen";
import { initializeNotifications } from "./src/services/notifications";
import { theme } from "./src/styles/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}

function AppShell() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskComposerVisible, setTaskComposerVisible] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    category: "",
    dueAt: "",
  });
  const { isReady } = useAppReady();
  const insets = useSafeAreaInsets();
  const { profile, hasAccount, updateProfileField, saveProfile, clearProfile } =
    useProfile();
  const {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    removeTask,
    completedCount,
    pendingCount,
    overdueCount,
    completedToday,
    categorySummary,
    completionHistory,
  } = useTasks();
  const shouldShowLogin = !hasAccount;

  useEffect(() => {
    initializeNotifications();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  function handleTaskFieldChange(field, value) {
    setTaskForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleAddTask() {
    const created = editingTaskId
      ? await updateTask(editingTaskId, taskForm)
      : await addTask(taskForm);

    if (created) {
      setTaskForm({ title: "", category: "", dueAt: "" });
      setEditingTaskId(null);
      setTaskComposerVisible(false);
    }

    return created;
  }

  function handleEditTask(task) {
    setCurrentScreen("tasks");
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      category: task.category,
      dueAt: task.dueAt || "",
    });
    setTaskComposerVisible(true);
  }

  function handleOpenTaskComposer() {
    setCurrentScreen("tasks");
    setEditingTaskId(null);
    setTaskForm({ title: "", category: "", dueAt: "" });
    setTaskComposerVisible(true);
  }

  function handleCancelEditing() {
    setEditingTaskId(null);
    setTaskForm({ title: "", category: "", dueAt: "" });
    setTaskComposerVisible(false);
  }

  async function handleCompleteProfile() {
    if (!profile.name.trim()) {
      Alert.alert(
        "Nome obrigatório",
        "Crie sua conta preenchendo ao menos o nome.",
      );
      return;
    }

    await saveProfile();
    setCurrentScreen("home");
  }

  async function handleSaveProfileChanges() {
    if (!profile.name.trim()) {
      Alert.alert(
        "Nome obrigatório",
        "Preencha ao menos o nome para salvar o perfil.",
      );
      return false;
    }

    await saveProfile();
    return true;
  }

  function handleNavigate(screen) {
    setCurrentScreen(screen);

    if (screen !== "tasks") {
      setTaskComposerVisible(false);
      setEditingTaskId(null);
      setTaskForm({ title: "", category: "", dueAt: "" });
    }
  }

  function handleLogout() {
    Alert.alert("Sair da conta", "Deseja sair e voltar para a tela de login?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await clearProfile();
          setCurrentScreen("home");
          setEditingTaskId(null);
          setTaskForm({ title: "", category: "", dueAt: "" });
        },
      },
    ]);
  }

  return (
    <View style={styles.appShell}>
      <StatusBar style="light" />
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />
      <View style={styles.contentWrap}>
        {shouldShowLogin ? (
          <LoginScreen
            profile={profile}
            onChangeField={updateProfileField}
            onSubmit={handleCompleteProfile}
          />
        ) : currentScreen === "home" ? (
          <HomeScreen
            completedCount={completedCount}
            pendingCount={pendingCount}
            overdueCount={overdueCount}
            completedToday={completedToday}
            dailyGoal={Number(profile.dailyGoal || 0)}
            onOpenTasks={() => handleNavigate("tasks")}
          />
        ) : currentScreen === "tasks" ? (
          <TasksScreen
            tasks={tasks}
            editingTaskId={editingTaskId}
            composerVisible={taskComposerVisible}
            form={taskForm}
            onFormChange={handleTaskFieldChange}
            onSubmitTask={handleAddTask}
            onOpenComposer={handleOpenTaskComposer}
            onCloseComposer={handleCancelEditing}
            onEditTask={handleEditTask}
            onToggleTask={toggleTask}
            onRemoveTask={removeTask}
          />
        ) : (
          <ProfileScreen
            profile={profile}
            hasAccount={hasAccount}
            totalTasks={tasks.length}
            completedCount={completedCount}
            pendingCount={pendingCount}
            overdueCount={overdueCount}
            completedToday={completedToday}
            dailyGoal={Number(profile.dailyGoal || 0)}
            completionHistory={completionHistory}
            onChangeField={updateProfileField}
            onSave={handleSaveProfileChanges}
            onLogout={handleLogout}
          />
        )}
      </View>

      {shouldShowLogin ? null : (
        <View
          style={[
            styles.bottomNav,
            { bottom: Math.max(insets.bottom + 18, 30) },
          ]}
        >
          <FooterNavButton
            active={currentScreen === "home"}
            onPress={() => handleNavigate("home")}
            icon={
              <House
                color={
                  currentScreen === "home"
                    ? theme.colors.text
                    : theme.colors.textSoft
                }
                size={24}
                strokeWidth={2.3}
              />
            }
          />

          <FooterNavButton
            active={currentScreen === "tasks"}
            onPress={() => handleNavigate("tasks")}
            icon={
              <ClipboardList
                color={
                  currentScreen === "tasks"
                    ? theme.colors.text
                    : theme.colors.textSoft
                }
                size={24}
                strokeWidth={2.2}
              />
            }
          />

          <FooterNavButton
            active={currentScreen === "profile"}
            onPress={() => handleNavigate("profile")}
            icon={
              <UserRound
                color={
                  currentScreen === "profile"
                    ? theme.colors.text
                    : theme.colors.textSoft
                }
                size={24}
                strokeWidth={2.3}
              />
            }
          />
        </View>
      )}
    </View>
  );
}

function FooterNavButton({ active, onPress, icon }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.navButton,
        active && styles.navButtonActive,
        pressed && styles.navButtonPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.navIconWrap, active && styles.navIconWrapActive]}>
        {icon}
      </View>
      <View
        style={[styles.navIndicator, active && styles.navIndicatorActive]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundGlowTop: {
    position: "absolute",
    top: -100,
    right: -24,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(125, 56, 255, 0.24)",
  },
  backgroundGlowBottom: {
    position: "absolute",
    bottom: 28,
    left: -52,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(69, 0, 140, 0.2)",
  },
  contentWrap: {
    flex: 1,
  },
  bottomNav: {
    position: "absolute",
    left: theme.spacing.xl,
    right: theme.spacing.xl,
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
    backgroundColor: "rgba(14, 8, 24, 0.94)",
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.24,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  navButton: {
    flex: 1,
    minHeight: 74,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 24,
    paddingVertical: 8,
    backgroundColor: "rgba(38, 21, 60, 0.48)",
  },
  navButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  navButtonActive: {
    backgroundColor: "rgba(125, 56, 255, 0.16)",
  },
  navIconWrap: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: "rgba(86, 49, 129, 0.55)",
  },
  navIconWrapActive: {
    backgroundColor: theme.colors.primaryStrong,
    borderColor: theme.colors.borderStrong,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  navIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(141, 121, 178, 0.34)",
  },
  navIndicatorActive: {
    width: 22,
    backgroundColor: theme.colors.gold,
  },
});
