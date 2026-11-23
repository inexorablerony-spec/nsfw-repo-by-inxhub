import { Info, ProviderContext } from "../types";
export const getMeta = async function ({ link, providerContext }: any): Promise<Info> {
  const empty: Info = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://spankbang.com/" }, timeout: 25000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().replace(/\s*-\s*SpankBang.*/i, "").trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const urls = html.match(/https?:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/gi) || [];
    const directLinks = urls.slice(0, 3).map((u: string) => ({ title: u.includes("m3u8") ? "HLS" : "MP4", link: u, type: u.includes("m3u8") ? "m3u8" : "mp4" }));
    const linkList = directLinks.length ? [{ title: "Play", quality: "HD", directLinks }] : [{ title: "Play", quality: "HD", directLinks: [{ title: "Play", link, type: "mp4" }] }];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
