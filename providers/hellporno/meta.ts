import { Info, ProviderContext } from "../types";
export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://hellporno.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links: Info["linkList"] = [];
    const seen = new Set<string>();
    // get_file pattern
    const gf = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
    for (const u of gf) {
      const clean = u.replace(/&amp;/g, "&");
      if (seen.has(clean)) continue;
      seen.add(clean);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: clean, type: "movie" }] });
    }
    // generic mp4
    const mp4 = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const u of mp4.slice(0, 3)) {
      const clean = u.replace(/&amp;/g, "&");
      if (seen.has(clean) || /thumb|preview|sprite/i.test(clean)) continue;
      seen.add(clean);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: clean, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
