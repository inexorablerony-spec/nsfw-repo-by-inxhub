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
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://spankbang.com/" },
      timeout: 25000,
    });
    const html = String(res.data || "");
    const $ = cheerio.load(html);

    const title = $("h1").first().text().trim() || $("title").text().replace(/\s*-\s*SpankBang.*/i, "").trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const directLinks: any[] = [];
    // Spankbang stream variables
    const streamData = html.match(/var stream_data\s*=\s*({[^}]+})/)?.[1];
    if (streamData) {
      try {
        const data = JSON.parse(streamData.replace(/'/g, '"'));
        for (const [q, urls] of Object.entries(data)) {
          if (Array.isArray(urls) && urls[0]) {
            directLinks.push({ title: q, link: urls[0], type: "mp4" });
          }
        }
      } catch {}
    }
    // Fallback regex for mp4/m3u8
    if (!directLinks.length) {
      const urls = html.match(/https?:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/gi) || [];
      for (const u of urls.slice(0, 3)) {
        directLinks.push({ title: u.includes("m3u8") ? "HLS" : "MP4", link: u, type: u.includes("m3u8") ? "m3u8" : "mp4" });
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
