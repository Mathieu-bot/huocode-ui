const DEV_FALLBACK = "http://localhost:8080";

export type ApiBase = { basePath: string; configured: boolean };

/**
 * Where the API lives. A production build without NEXT_PUBLIC_HUO_API_URL
 * must not crash: it reports itself as unconfigured so every call fails like
 * an unreachable network, which the UI already explains to the user.
 */
export function resolveApiBase(
  configuredUrl: string | undefined,
  nodeEnv: string | undefined,
): ApiBase {
  const configured = configuredUrl?.trim();
  if (configured) {
    return { basePath: configured.replace(/\/+$/, ""), configured: true };
  }
  if (nodeEnv === "production") {
    return { basePath: "", configured: false };
  }
  return { basePath: DEV_FALLBACK, configured: true };
}
