"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
    var _a;
    const empty = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
    try {
        const { axios, cheerio } = providerContext;
        const res = await axios.get(link, {
            headers: { "User-Agent": "Mozilla/5.0", Referer: "https://spankbang.com/", Cookie: "country=US" },
            timeout: 25000,
        });
        const html = String(res.data || "");
        const $ = cheerio.load(html);
        const title = $("h1").first().text().trim() || $("title").text().replace(/\s*-\s*SpankBang.*/i, "").trim() || "Untitled";
        const image = $('meta[property="og:image"]').attr("content") || "";
        const directLinks = [];
        // stream_url_ pattern from yt-dlp
        const streamUrls = html.match(/stream_url_[^\s=]+\s*=\s*["']([^"']+)["']/gi) || [];
        for (const m of streamUrls) {
            const u = (_a = m.match(/["']([^"']+)["']/)) === null || _a === void 0 ? void 0 : _a[1];
            if (u && (u.includes(".mp4") || u.includes(".m3u8"))) {
                directLinks.push({ title: u.includes("m3u8") ? "HLS" : "MP4", link: u, type: u.includes("m3u8") ? "m3u8" : "mp4" });
            }
        }
        // Fallback
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
    }
    catch (_b) {
        return empty;
    }
};
exports.getMeta = getMeta;
