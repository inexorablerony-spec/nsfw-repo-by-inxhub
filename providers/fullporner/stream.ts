import { Stream, ProviderContext } from "../types";

export const getStream = async function ({
  link,
  type,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  if (!link) return [];
  const { axios } = providerContext;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    Referer: "https://xiaoshenke.net/",
  };

  // If it's a xiaoshenke redirect, follow it to the final CDN URL
  if (link.includes("xiaoshenke.net")) {
    try {
      const res = await axios.get(link, { headers, maxRedirects: 5, signal, timeout: 15000, validateStatus: () => true });
      const finalUrl = res.request?.res?.responseUrl || res.config?.url || link;
      if (finalUrl && finalUrl !== link && finalUrl.startsWith("http")) {
        return [{ server: "FullPorner", link: finalUrl, type: "mp4", headers }];
      }
    } catch {}
    return [{ server: "FullPorner", link, type: "mp4", headers }];
  }

  return [{ server: "FullPorner", link, type: "mp4", headers: { ...headers, Referer: "https://fullporner.com/" } }];
};
