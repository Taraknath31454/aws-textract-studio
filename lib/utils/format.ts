export function cn(...values: Array<string | false | null | undefined>) { return values.filter(Boolean).join(" "); }
export function maskValue(value: string) {
  if (value.includes("@")) { const [name, domain] = value.split("@"); return `${name[0] ?? "•"}${"•".repeat(Math.max(3, name.length - 1))}@${domain}`; }
  const visible = value.replace(/\s/g, "").slice(-4);
  return `${"•".repeat(Math.min(12, Math.max(4, value.length - 4)))}${visible}`;
}
export function downloadFile(filename: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

