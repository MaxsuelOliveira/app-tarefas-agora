export function formatDueDate(value) {
  if (!value) {
    return "Sem prazo";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sem prazo";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getTaskStatus(task) {
  if (task.done) {
    return "Concluída";
  }

  if (!task.dueAt) {
    return "Sem prazo";
  }

  const dueDate = new Date(task.dueAt);

  if (Number.isNaN(dueDate.getTime())) {
    return "Sem prazo";
  }

  return dueDate <= new Date() ? "Atrasada" : "Agendada";
}

export function buildTaskDate(baseDate, sourceDate) {
  const nextDate = new Date(baseDate);

  nextDate.setFullYear(sourceDate.getFullYear());
  nextDate.setMonth(sourceDate.getMonth());
  nextDate.setDate(sourceDate.getDate());
  nextDate.setHours(sourceDate.getHours());
  nextDate.setMinutes(sourceDate.getMinutes());
  nextDate.setSeconds(0);
  nextDate.setMilliseconds(0);

  return nextDate;
}
