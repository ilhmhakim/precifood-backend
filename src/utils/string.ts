export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength).trim();
  return truncated.slice(0, truncated.lastIndexOf(" ")) + "...";
};

export const formatDate = (epochMs: number | undefined) => {
  if (!epochMs) return "";
  return new Date(epochMs).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};