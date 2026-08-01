import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../../styles/theme";
import { formatDueDate, getTaskStatus } from "../../utils/date";
import { PremiumPanel } from "../common/PremiumPanel";
import {
  AlertTriangle,
  BellRing,
  CheckCheck,
  Clock3,
  Pencil,
  Trash2,
} from "../common/icons";

export function TaskCard({ task, onToggle, onEdit, onRemove }) {
  const intro = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;
  const swipeHandled = useRef(false);

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [intro]);

  const taskStatus = getTaskStatus(task);
  const completeOpacity = swipeX.interpolate({
    inputRange: [0, 50, 120],
    outputRange: [0, 0.35, 1],
    extrapolate: "clamp",
  });
  const deleteOpacity = swipeX.interpolate({
    inputRange: [-120, -50, 0],
    outputRange: [1, 0.35, 0],
    extrapolate: "clamp",
  });
  const completeScale = swipeX.interpolate({
    inputRange: [0, 120],
    outputRange: [0.85, 1.08],
    extrapolate: "clamp",
  });
  const deleteScale = swipeX.interpolate({
    inputRange: [-120, 0],
    outputRange: [1.08, 0.85],
    extrapolate: "clamp",
  });
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          Math.abs(gestureState.dx) > 12 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderMove: (_event, gestureState) => {
          swipeX.setValue(Math.max(-132, Math.min(132, gestureState.dx)));
        },
        onPanResponderRelease: (_event, gestureState) => {
          if (gestureState.dx >= 96) {
            swipeHandled.current = true;
            Animated.timing(swipeX, {
              toValue: 160,
              duration: 180,
              useNativeDriver: true,
            }).start(async () => {
              await onToggle(task.id);
              swipeHandled.current = false;
              swipeX.setValue(0);
            });

            return;
          }

          if (gestureState.dx <= -96) {
            swipeHandled.current = true;
            Animated.timing(swipeX, {
              toValue: -160,
              duration: 180,
              useNativeDriver: true,
            }).start(async () => {
              await onRemove(task.id);
              swipeHandled.current = false;
              swipeX.setValue(0);
            });

            return;
          }

          Animated.spring(swipeX, {
            toValue: 0,
            useNativeDriver: true,
            speed: 18,
            bounciness: 6,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(swipeX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [onRemove, onToggle, swipeX, task.id],
  );

  useEffect(() => {
    if (!swipeHandled.current) {
      swipeX.setValue(0);
    }
  }, [swipeX, task.done]);

  return (
    <View style={styles.swipeWrap}>
      <View style={styles.swipeBackdrop}>
        <Animated.View
          style={[
            styles.swipeAction,
            styles.swipeActionLeft,
            {
              opacity: completeOpacity,
              transform: [{ scale: completeScale }],
            },
          ]}
        >
          <CheckCheck color={theme.colors.text} size={20} strokeWidth={2.5} />
          <Text style={styles.swipeCompleteHint}>Concluir</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.swipeAction,
            styles.swipeActionRight,
            {
              opacity: deleteOpacity,
              transform: [{ scale: deleteScale }],
            },
          ]}
        >
          <Trash2 color={theme.colors.text} size={20} strokeWidth={2.5} />
          <Text style={styles.swipeDeleteHint}>Excluir</Text>
        </Animated.View>
      </View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.cardWrap,
          {
            opacity: intro,
            transform: [
              {
                translateY: intro.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
              {
                translateX: swipeX,
              },
            ],
          },
        ]}
      >
        <PremiumPanel
          style={[styles.card, taskStatus === "Atrasada" && styles.cardWarning]}
          bottomGlowColor={
            taskStatus === "Atrasada"
              ? "rgba(255, 177, 85, 0.18)"
              : theme.colors.accentSoft
          }
        >
          <Pressable
            style={[styles.checkButton, task.done && styles.checkButtonDone]}
            onPress={() => onToggle(task.id)}
          >
            {task.done ? (
              <CheckCheck
                color={theme.colors.text}
                size={19}
                strokeWidth={2.5}
              />
            ) : (
              <Clock3 color={theme.colors.text} size={19} strokeWidth={2.3} />
            )}
          </Pressable>

          <View style={styles.copyWrap}>
            <View style={styles.topRow}>
              <Text style={[styles.category, task.done && styles.doneText]}>
                {task.category}
              </Text>
              <View
                style={[
                  styles.statusChip,
                  taskStatus === "Atrasada" && styles.statusChipWarning,
                ]}
              >
                {taskStatus === "Atrasada" ? (
                  <AlertTriangle
                    color={theme.colors.warning}
                    size={15}
                    strokeWidth={2.2}
                  />
                ) : (
                  <BellRing
                    color={theme.colors.primary}
                    size={15}
                    strokeWidth={2.2}
                  />
                )}
                <Text
                  style={[
                    styles.statusText,
                    taskStatus === "Atrasada" && styles.statusTextWarning,
                  ]}
                >
                  {taskStatus}
                </Text>
              </View>
            </View>
            <Text style={[styles.title, task.done && styles.doneText]}>
              {task.title}
            </Text>
            <Text style={styles.deadline}>{formatDueDate(task.dueAt)}</Text>
          </View>

          <View style={styles.actionColumn}>
            <Pressable style={styles.editButton} onPress={() => onEdit(task)}>
              <Pencil color={theme.colors.text} size={18} strokeWidth={2.3} />
            </Pressable>
            <Text style={styles.gestureHint}>Arraste</Text>
          </View>
        </PremiumPanel>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeWrap: {
    position: "relative",
  },
  swipeBackdrop: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  swipeAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
  },
  swipeActionLeft: {
    backgroundColor: theme.colors.success,
  },
  swipeActionRight: {
    backgroundColor: theme.colors.danger,
  },
  swipeCompleteHint: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  swipeDeleteHint: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  cardWrap: {
    borderRadius: theme.radius.lg,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    overflow: "hidden",
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  cardWarning: {
    borderColor: theme.colors.warning,
  },
  checkButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkButtonDone: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  copyWrap: {
    flex: 1,
    gap: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  category: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
  },
  statusChipWarning: {
    backgroundColor: "rgba(255, 177, 85, 0.12)",
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextWarning: {
    color: theme.colors.warning,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  deadline: {
    color: theme.colors.textSoft,
    fontSize: 14,
  },
  doneText: {
    color: theme.colors.textSoft,
    textDecorationLine: "line-through",
  },
  actionColumn: {
    alignItems: "flex-end",
    gap: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  gestureHint: {
    color: theme.colors.textSoft,
    fontSize: 14,
    fontWeight: "700",
  },
});
