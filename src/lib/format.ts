export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const days = Math.round((Date.now() - then) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

export function formatDate(iso: string | null) {
  if (!iso) return "No deadline";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function deadlineLabel(iso: string | null) {
  if (!iso) return { text: "Rolling", urgent: false };
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (Number.isNaN(days)) return { text: iso, urgent: false };
  if (days < 0) return { text: "Closed", urgent: false };
  if (days === 0) return { text: "Closes today", urgent: true };
  if (days <= 7) return { text: `${days}d left`, urgent: true };
  return { text: formatDate(iso), urgent: false };
}

export function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function contactHref(preference: string, handle: string) {
  const value = handle.trim();
  if (!value) return null;
  switch (preference) {
    case "WhatsApp":
      return `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
    case "LinkedIn":
      return value.startsWith("http") ? value : `https://linkedin.com/in/${value}`;
    case "Phone":
      return `tel:${value.replace(/\s/g, "")}`;
    default:
      return value.includes("@") ? `mailto:${value}` : value;
  }
}
