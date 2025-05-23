/**
 * Formata horas decimais para exibição no formato "Xh Ym"
 * Ex: 1.5 -> "1h 30m", 0.25 -> "0h 15m"
 */
export const formatHoursToDisplay = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  
  if (hours === 0 && minutes === 0) return "0h";
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  
  return `${hours}h ${minutes}m`;
};

/**
 * Formata horas decimais para exibição em tooltip no formato "HH:MM"
 * Ex: 1.5 -> "01:30", 0.25 -> "00:15"
 */
export const formatHoursForTooltip = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  
  return `${hoursStr}:${minutesStr}`;
};

/**
 * Converte string no formato "HH:MM" para horas decimais
 * Ex: "01:30" -> 1.5, "00:15" -> 0.25
 */
export const parseTimeToDecimal = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + (minutes / 60);
};
