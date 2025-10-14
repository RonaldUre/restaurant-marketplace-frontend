// Interfaces para definir la estructura del JSON
interface TimeRangeObject {
  from: string;
  to: string;
}
type TimeRangeTuple = [string, string];
type TimeRange = TimeRangeObject | TimeRangeTuple;

type OpeningHours = {
  [day: string]: TimeRange[];
};

// Mapa de días de la semana
const dayMap: { [key: number]: string } = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

/**
 * Normaliza un rango de tiempo (objeto o tupla) a un objeto con 'from' y 'to'.
 */
function normalizeTimeRange(range: TimeRange): TimeRangeObject | null {
  if (Array.isArray(range) && range.length === 2) {
    return { from: range[0], to: range[1] };
  }
  if (typeof range === 'object' && 'from' in range && 'to' in range) {
    return range as TimeRangeObject;
  }
  console.warn("Invalid time range format detected:", range);
  return null;
}

/**
 * Convierte una hora en formato "HH:MM" a minutos desde la medianoche.
 */
function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}


/**
 * Revisa si un restaurante está abierto ahora, basándose en su JSON de horarios.
 * Esta versión es compatible con ambos formatos: [{"from": "H:M", "to": "H:M"}] y [["H:M", "H:M"]].
 * @param openingHoursJson - El JSON de horarios del restaurante.
 * @returns {boolean} - True si está abierto, false si está cerrado o hay un error.
 */
export function isRestaurantOpenNow(openingHoursJson: string): boolean {
  try {
    if (!openingHoursJson) return false;

    const hours: OpeningHours = JSON.parse(openingHoursJson);
    const now = new Date();
    const currentDayName = dayMap[now.getDay()];
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const todaysHours = hours[currentDayName];
    if (!todaysHours || todaysHours.length === 0) {
      return false; // Cerrado hoy
    }

    for (const range of todaysHours) {
      const normalizedRange = normalizeTimeRange(range);
      if (!normalizedRange) continue; // Ignora rangos con formato incorrecto

      const fromTime = timeStringToMinutes(normalizedRange.from);
      const toTime = timeStringToMinutes(normalizedRange.to);

      if (currentTimeInMinutes >= fromTime && currentTimeInMinutes < toTime) {
        return true; // Abierto ahora
      }
    }

    return false; // Cerrado a esta hora
  } catch (error) {
    console.error("Error al parsear los horarios de apertura:", error);
    return false; // Asumir cerrado si hay un error
  }
}
