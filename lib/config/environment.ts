export type DataMode = "mock" | "api";

function readDataMode(value: string | undefined): DataMode {
  return value?.toLowerCase() === "api" ? "api" : "mock";
}

function normalizeBaseUrl(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/+$/, "") : null;
}

/**
 * Public, build-time configuration only. Never place AWS credentials or other
 * secrets in NEXT_PUBLIC variables because they are shipped to the browser.
 */
export const publicEnvironment = Object.freeze({
  dataMode: readDataMode(process.env.NEXT_PUBLIC_DATA_MODE),
  apiBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
});

