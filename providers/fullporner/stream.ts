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

  if (link.includes("xiaoshenke.net")) {
    try {
      // Manual redirect follow to get the final video URL
      let current = link;
      for (let i = 0; i < 5; i++) {
        const res = await axios.get(current, {
          headers,
          maxRedirects: 0,
          signal,
          timeout: 10000,
          validateStatus: (s: number) => s >= 200 && s < 400,
        });
        const loc = res.headers?.location || res.headers?.Location;
        if (!loc) break;
        current = loc.startsWith("//") ? "https:" + loc : loc.startsWith("/") ? "https://xiaoshenke.net" + loc : loc;
        if (current.includes("/s0/") || current.includes(".mp4")) break;
      }
      if (current !== link) {
        return [{ server: "FullPorner", link: current, type: "mp4", headers }];
      }
    } catch {}
    // Fallback: return original and let player handle redirect
    return [{ server: "FullPorner", link, type: "mp4", headers }];
  }

  return [{ server: "FullPorner", link, type: "mp4", headers: { ...headers, Referer: "https://fullporner.com/" } }];
};
