import Constants from "expo-constants";
import { Platform } from "react-native";

let notificationsModulePromise = null;
let handlerConfigured = false;
let expoGoWarningShown = false;

function isExpoGo() {
  return Constants.executionEnvironment === "storeClient";
}

async function getNotificationsModule() {
  if (isExpoGo()) {
    if (!expoGoWarningShown) {
      console.warn(
        "Notificações foram desativadas no Expo Go. Para testar alertas nativos, use um development build.",
      );
      expoGoWarningShown = true;
    }

    return null;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = import("expo-notifications");
  }

  const Notifications = await notificationsModulePromise;

  if (!handlerConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerConfigured = true;
  }

  return Notifications;
}

export async function initializeNotifications() {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return false;
  }

  const settings = await Notifications.getPermissionsAsync();

  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("tasks", {
      name: "Tasks",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  return true;
}

export async function scheduleTaskNotification(task) {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return null;
  }

  if (!task.dueAt) {
    return null;
  }

  const dueDate = new Date(task.dueAt);

  if (Number.isNaN(dueDate.getTime()) || dueDate <= new Date()) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Prazo chegando",
      body: `${task.title} vence agora${task.category ? ` · ${task.category}` : ""}`,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dueDate,
      channelId: "tasks",
    },
  });
}

export async function sendImmediateTaskNotification(task) {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Tarefa atrasada",
      body: `${task.title} está atrasada${task.category ? ` · ${task.category}` : ""}`,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
}

export async function cancelTaskNotification(notificationId) {
  const Notifications = await getNotificationsModule();

  if (!Notifications || !notificationId) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // no-op
  }
}
