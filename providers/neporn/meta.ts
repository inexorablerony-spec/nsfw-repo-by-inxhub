import { Info, ProviderContext } from "../types";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://neporn.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const directLinks: any[] = [];
    const seen = new Set<string>();
    const matches = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
    for (const u of matches) {
      const clean = u.replace(/&amp;/g, "&");
      if (/preview|thumb/i.test(clean) || seen.has(clean)) continue;
      seen.add(clean);
      const q = clean.match(/_(\d+p)\.mp4/i)?.[1] || "480p";
      directLinks.push({ title: q, link: clean, type: "mp4" });
    }
    directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
    if (directLinks.length === 0) directLinks.push({ title: "Play", link, type: "mp4" });
    const linkList = [{ title: "Play", quality: directLinks[0]?.title || "HD", directLinks }];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
