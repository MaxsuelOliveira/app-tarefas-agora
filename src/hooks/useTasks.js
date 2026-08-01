import { useEffect, useMemo, useState } from "react";
import { LayoutAnimation, Platform, UIManager } from "react-native";
import {
  cancelTaskNotification,
  scheduleTaskNotification,
  sendImmediateTaskNotification,
} from "../services/notifications";
import { getStoredJson, setStoredJson } from "../services/storage";
import { getTaskStatus } from "../utils/date";

const TASKS_STORAGE_KEY = "tarefas-agora:tasks";

const defaultTasks = [
  {
    id: "seed-1",
    title: "Criar a estrutura inicial do app",
    category: "Projeto",
    done: true,
    dueAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    notificationId: null,
    completedAt: new Date().toISOString(),
    overdueNotifiedAt: null,
    createdAt: "2026-04-14T00:00:00.000Z",
  },
  {
    id: "seed-2",
    title: "Começar o CRUD de tarefas",
    category: "Home",
    done: false,
    dueAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    notificationId: null,
    completedAt: null,
    overdueNotifiedAt: null,
    createdAt: "2026-04-14T00:10:00.000Z",
  },
];

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function useTasks() {
  const [tasks, setTasks] = useState(defaultTasks);
  const [storageReady, setStorageReady] = useState(false);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setClock(Date.now());
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function hydrateTasks() {
      const storedTasks = await getStoredJson(TASKS_STORAGE_KEY, defaultTasks);

      if (Array.isArray(storedTasks) && storedTasks.length) {
        setTasks(storedTasks);
      }

      setStorageReady(true);
    }

    hydrateTasks();
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    setStoredJson(TASKS_STORAGE_KEY, tasks);
  }, [storageReady, tasks]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    const overdueTasks = tasks.filter(
      (task) =>
        !task.done &&
        getTaskStatus(task) === "Atrasada" &&
        !task.overdueNotifiedAt,
    );

    if (!overdueTasks.length) {
      return;
    }

    let isCancelled = false;

    async function syncOverdueNotifications() {
      const updates = await Promise.all(
        overdueTasks.map(async (task) => ({
          id: task.id,
          overdueNotifiedAt: new Date().toISOString(),
          overdueNotificationId: await sendImmediateTaskNotification(task),
        })),
      );

      if (isCancelled) {
        return;
      }

      setTasks((current) =>
        current.map((task) => {
          const nextUpdate = updates.find((item) => item.id === task.id);

          return nextUpdate
            ? {
                ...task,
                ...nextUpdate,
              }
            : task;
        }),
      );
    }

    syncOverdueNotifications();

    return () => {
      isCancelled = true;
    };
  }, [clock, storageReady, tasks]);

  async function addTask(form) {
    const title = form.title.trim();
    const category = form.category.trim();

    if (!title) {
      return false;
    }

    const nextTask = {
      id: `${Date.now()}`,
      title,
      category: category || "Geral",
      done: false,
      dueAt: form.dueAt || null,
      notificationId: null,
      completedAt: null,
      overdueNotifiedAt: null,
      createdAt: new Date().toISOString(),
    };

    if (nextTask.dueAt) {
      nextTask.notificationId = await scheduleTaskNotification(nextTask);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setTasks((current) => [nextTask, ...current]);

    return true;
  }

  async function updateTask(taskId, form) {
    const title = form.title.trim();
    const category = form.category.trim();
    const currentTask = tasks.find((task) => task.id === taskId);

    if (!title || !currentTask) {
      return false;
    }

    if (currentTask.notificationId) {
      await cancelTaskNotification(currentTask.notificationId);
    }

    const nextTask = {
      ...currentTask,
      title,
      category: category || "Geral",
      dueAt: form.dueAt || null,
      notificationId: null,
      overdueNotifiedAt: null,
    };

    if (!nextTask.done && nextTask.dueAt) {
      nextTask.notificationId = await scheduleTaskNotification(nextTask);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? nextTask : task)),
    );

    return true;
  }

  async function toggleTask(taskId) {
    const currentTask = tasks.find((task) => task.id === taskId);

    if (!currentTask) {
      return;
    }

    if (!currentTask.done && currentTask.notificationId) {
      await cancelTaskNotification(currentTask.notificationId);
    }

    let nextNotificationId = null;
    const nextDoneState = !currentTask.done;

    if (currentTask.done && currentTask.dueAt) {
      nextNotificationId = await scheduleTaskNotification(currentTask);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              done: nextDoneState,
              completedAt: nextDoneState ? new Date().toISOString() : null,
              notificationId: task.done ? nextNotificationId : null,
              overdueNotifiedAt: nextDoneState ? task.overdueNotifiedAt : null,
            }
          : task,
      ),
    );
  }

  async function removeTask(taskId) {
    const currentTask = tasks.find((task) => task.id === taskId);

    if (currentTask?.notificationId) {
      await cancelTaskNotification(currentTask.notificationId);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  const completedCount = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks],
  );
  const pendingCount = tasks.length - completedCount;
  const overdueCount = useMemo(
    () =>
      tasks.filter((task) => !task.done && getTaskStatus(task) === "Atrasada")
        .length,
    [clock, tasks],
  );
  const completedToday = useMemo(() => {
    const today = new Date();

    return tasks.filter((task) => {
      if (!task.completedAt) {
        return false;
      }

      const completedDate = new Date(task.completedAt);

      return (
        completedDate.getDate() === today.getDate() &&
        completedDate.getMonth() === today.getMonth() &&
        completedDate.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [tasks]);
  const categorySummary = useMemo(() => {
    const buckets = tasks.reduce((accumulator, task) => {
      if (task.done) {
        return accumulator;
      }

      const category = task.category || "Geral";

      accumulator[category] = (accumulator[category] || 0) + 1;

      return accumulator;
    }, {});

    return Object.entries(buckets)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }));
  }, [tasks]);
  const completionHistory = useMemo(() => {
    const days = Array.from({ length: 7 }, (_value, index) => {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      return {
        key: date.toISOString(),
        label: new Intl.DateTimeFormat("pt-BR", {
          weekday: "short",
        })
          .format(date)
          .replace(".", "")
          .slice(0, 3),
        fullLabel: new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }).format(date),
        count: 0,
      };
    });

    tasks.forEach((task) => {
      if (!task.completedAt) {
        return;
      }

      const completedDate = new Date(task.completedAt);

      if (Number.isNaN(completedDate.getTime())) {
        return;
      }

      completedDate.setHours(0, 0, 0, 0);

      const bucket = days.find(
        (day) => new Date(day.key).getTime() === completedDate.getTime(),
      );

      if (bucket) {
        bucket.count += 1;
      }
    });

    return days;
  }, [tasks]);

  return {
    tasks,
    storageReady,
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
  };
}
