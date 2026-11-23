import { Info, ProviderContext } from "../types";
export const getMeta = async function ({ link, providerContext }: any): Promise<Info> {
  const empty: Info = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.pornhat.com/" }, timeout: 25000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().replace(/\s*-\s*PornHat.*/i, "").trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const sources = html.match(/source src="(https?:\/\/[^"]+get_file[^"]+\.mp4[^"]*)"/gi) || [];
    const directLinks = sources.map((s: string) => {
      const u = s.match(/src="([^"]+)"/)?.[1] || "";
      const q = u.includes("720") ? "720p" : u.includes("360") ? "360p" : "MP4";
      return { title: q, link: u, type: "mp4" };
    }).filter((d: any) => d.link);
    const linkList = directLinks.length ? [{ title: "Play", quality: "HD", directLinks }] : [{ title: "Play", quality: "HD", directLinks: [{ title: "Play", link, type: "mp4" }] }];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
