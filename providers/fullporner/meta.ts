import { Info, ProviderContext } from "../types";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const empty: Info = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://fullporner.com/" },
      timeout: 25000,
    });
    const html = String(res.data || "");
    const $ = cheerio.load(html);

    const title = $("h1, .video-title").first().text().trim() || $("title").text().replace(/\s*\|.*/i, "").trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const iframeUrl = $("div.single-video iframe, iframe").first().attr("src") || "";
    const directLinks: any[] = [];

    // xiaoshenke direct links from iframe pattern /player/<id>/<flag> or /video/<id>/<flag>
    const m = iframeUrl.match(/\/(?:video|player)\/([^/]+)\/(\d+)/);
    if (m) {
      const reversedId = m[1].split("").reverse().join("");
      const flag = parseInt(m[2], 10);
      const qualities = [
        [1, "360p"],
        [2, "480p"],
        [4, "720p"],
        [8, "1080p"],
      ].filter(([bit]) => (flag & (bit as number)) !== 0);
      for (const [bit, q] of qualities) {
        directLinks.push({
          title: q,
          link: `https://xiaoshenke.net/vid/${reversedId}/${bit}`,
          type: "mp4",
        });
      }
    }

    const linkList = directLinks.length
      ? [{ title: "Play", quality: "HD", directLinks }]
      : [{ title: "Play", quality: "HD", directLinks: [{ title: "Play", link, type: "mp4" }] }];

    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch {
    return empty;
  }
};
