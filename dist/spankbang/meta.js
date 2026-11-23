// @vega-provider spankbang
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://spankbang.com/", Cookie: "country=US" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || "SpankBang";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const keyMatch = html.match(/data-streamkey\s*=\s*["']([^"']+)["']/i);
    if (keyMatch) {
      const form = new URLSearchParams();
      form.append("id", keyMatch[1]);
      form.append("data", "0");
      const streamRes = await axios.post("https://spankbang.com/api/videos/stream", form.toString(), {
        headers: { "User-Agent": "Mozilla/5.0", Referer: link, Origin: "https://spankbang.com", "X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded", Cookie: "country=US" },
        timeout: 20000
      });
      let data = streamRes.data;
      if (typeof data === "string") data = JSON.parse(data);
      if (data && typeof data === "object") {
        for (const [q, v] of Object.entries(data)) {
          const url = Array.isArray(v) ? v[0] : v;
          if (typeof url === "string" && (url.includes(".mp4") || url.includes(".m3u8"))) {
            links.push({ title: "Play (" + q + ")", quality: q, directLinks: [{ title: q, link: url, type: "movie" }] });
          }
        }
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
