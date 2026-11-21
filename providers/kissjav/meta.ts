import { Info, ProviderContext } from "../types";

function b64decode(s: string): string {
  try {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let i = 0;
    s = s.replace(/[^A-Za-z0-9+/=]/g, "");
    while (i < s.length) {
      const enc1 = chars.indexOf(s.charAt(i++));
      const enc2 = chars.indexOf(s.charAt(i++));
      const enc3 = chars.indexOf(s.charAt(i++));
      const enc4 = chars.indexOf(s.charAt(i++));
      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;
      output += String.fromCharCode(chr1);
      if (enc3 !== 64) output += String.fromCharCode(chr2);
      if (enc4 !== 64) output += String.fromCharCode(chr3);
    }
    return output;
  } catch { return ""; }
}

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://kissjav.li/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";

    const directLinks: any[] = [];
    const b64Match = html.match(/video_url:\s*['"]([A-Za-z0-9+/=]+)['"]/);
    if (b64Match) {
      const decoded = b64decode(b64Match[1]);
      if (decoded && decoded.includes("get_file")) {
        directLinks.push({ title: "HD", link: decoded, type: "mp4" });
      }
    }
    if (directLinks.length === 0) directLinks.push({ title: "Play", link, type: "mp4" });
    const linkList = [{ title: "Play", quality: "HD", directLinks }];
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
