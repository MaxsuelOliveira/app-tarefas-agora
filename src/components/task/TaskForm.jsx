import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "../../styles/theme";
import { formatDueDate } from "../../utils/date";
import { PremiumPanel } from "../common/PremiumPanel";
import { CalendarDays, Plus, Tag, Type } from "../common/icons";

export function TaskForm({
  form,
  editing,
  onChange,
  onSubmit,
  onCancelEditing,
}) {
  const [pickerMode, setPickerMode] = useState(null);
  const intro = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [intro]);

  function animateButton(nextValue) {
    Animated.spring(ctaScale, {
      toValue: nextValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  }

  function handleDateTimeChange(_event, nextDate) {
    if (Platform.OS === "android") {
      setPickerMode(null);
    }

    if (!nextDate) {
      return;
    }

    const baseDate = form.dueAt ? new Date(form.dueAt) : new Date();

    if (pickerMode === "date") {
      baseDate.setFullYear(nextDate.getFullYear());
      baseDate.setMonth(nextDate.getMonth());
      baseDate.setDate(nextDate.getDate());
    }

    if (pickerMode === "time") {
      baseDate.setHours(nextDate.getHours());
      baseDate.setMinutes(nextDate.getMinutes());
      baseDate.setSeconds(0);
      baseDate.setMilliseconds(0);
    }

    onChange("dueAt", baseDate.toISOString());
  }

  return (
    <Animated.View
      style={[
        styles.cardWrap,
        {
          opacity: intro,
          transform: [
            {
              translateY: intro.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
          ],
        },
      ]}
    >
      <PremiumPanel style={styles.card} bottomGlowColor={theme.colors.goldSoft}>
        <Text style={styles.title}>Nova tarefa</Text>
        <Text style={styles.subtitle}>
          {editing
            ? "Atualize título, categoria, data e hora da tarefa selecionada."
            : "Crie uma tarefa em poucos toques e agende um alerta local com som."}
        </Text>

        <View style={styles.detailStrip}>
          <View style={styles.detailDot} />
          <Text style={styles.detailStripText}>
            Fluxo rápido, visual refinado e lembrete local integrado.
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Título</Text>
          <View style={styles.inputRow}>
            <Type color={theme.colors.primary} size={18} strokeWidth={2.2} />
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(value) => onChange("title", value)}
              placeholder="Ex.: Revisar tarefas do dia"
              placeholderTextColor={theme.colors.textSoft}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.inputRow}>
            <Tag color={theme.colors.primary} size={18} strokeWidth={2.2} />
            <TextInput
              style={styles.input}
              value={form.category}
              onChangeText={(value) => onChange("category", value)}
              placeholder="Ex.: Trabalho"
              placeholderTextColor={theme.colors.textSoft}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Prazo</Text>
          <Pressable
            style={styles.deadlineButton}
            onPress={() => setPickerMode("date")}
          >
            <View style={styles.deadlineCopy}>
              <CalendarDays
                color={theme.colors.primary}
                size={18}
                strokeWidth={2.2}
              />
              <Text style={styles.deadlineText}>
                {formatDueDate(form.dueAt)}
              </Text>
            </View>
            <Text style={styles.deadlineAction}>Definir</Text>
          </Pressable>

          <View style={styles.deadlineActionsRow}>
            <Pressable
              style={styles.deadlineSecondaryButton}
              onPress={() => setPickerMode("date")}
            >
              <Text style={styles.deadlineSecondaryText}>Data</Text>
            </Pressable>
            <Pressable
              style={styles.deadlineSecondaryButton}
              onPress={() => setPickerMode("time")}
            >
              <Text style={styles.deadlineSecondaryText}>Hora</Text>
            </Pressable>
            <Pressable
              style={styles.deadlineSecondaryButton}
              onPress={() => onChange("dueAt", "")}
            >
              <Text style={styles.deadlineSecondaryText}>Limpar</Text>
            </Pressable>
          </View>

          {pickerMode ? (
            <DateTimePicker
              mode={pickerMode}
              value={
                form.dueAt
                  ? new Date(form.dueAt)
                  : new Date(Date.now() + 60 * 60 * 1000)
              }
              onChange={handleDateTimeChange}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
            />
          ) : null}
        </View>

        <View style={styles.footerRow}>
          {editing ? (
            <Pressable style={styles.cancelButton} onPress={onCancelEditing}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          ) : null}

          <Animated.View
            style={[styles.submitWrap, { transform: [{ scale: ctaScale }] }]}
          >
            <Pressable
              style={styles.button}
              onPress={onSubmit}
              onPressIn={() => animateButton(0.97)}
              onPressOut={() => animateButton(1)}
            >
              <Plus color={theme.colors.text} size={20} strokeWidth={2.5} />
              <Text style={styles.buttonText}>
                {editing ? "Salvar tarefa" : "Adicionar tarefa"}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </PremiumPanel>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: theme.radius.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.28,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 26,
  },
  detailStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  detailDot: {
    width: 10,
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accent,
  },
  detailStripText: {
    flex: 1,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: theme.colors.text,
    fontSize: 17,
  },
  deadlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  deadlineCopy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  deadlineText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  deadlineAction: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  deadlineActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  deadlineSecondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.pill,
    paddingVertical: 12,
  },
  deadlineSecondaryText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  button: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: theme.colors.primaryStrong,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    shadowColor: theme.colors.primaryStrong,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  submitWrap: {
    flex: 1,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceUltra,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: "700",
  },
});
