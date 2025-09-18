/**
 * تنسيق التاريخ بالتقويم الميلادي مع الأرقام الإنجليزية
 * @param date التاريخ المراد تنسيقه
 * @returns التاريخ المنسق بالأرقام الإنجليزية
 */
export const formatDateWithEnglishNumerals = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * تنسيق التاريخ والوقت بالتقويم الميلادي مع الأرقام الإنجليزية
 * @param date التاريخ المراد تنسيقه
 * @returns التاريخ والوقت المنسق بالأرقام الإنجليزية
 */
export const formatDateTimeWithEnglishNumerals = (
  date: Date | string
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
