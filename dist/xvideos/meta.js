"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext, }) {
    var _a, _b, _c;
    const empty = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
    try {
        const { axios, cheerio } = providerContext;
        const res = await axios.get(link, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://www.xvideos.com/" },
            timeout: 25000,
        });
        const html = String(res.data || "");
        const $ = cheerio.load(html);
        const title = $("h2.page-title, h1").first().text().trim() || $("title").text().replace(/\s*-\s*XVIDEOS.*/i, "").trim() || "Untitled";
        const image = $('meta[property="og:image"]').attr("content") || "";
        const directLinks = [];
        const hls = (_a = html.match(/html5player\.setVideoHLS\('([^']+)'/)) === null || _a === void 0 ? void 0 : _a[1];
        const high = (_b = html.match(/html5player\.setVideoUrlHigh\('([^']+)'/)) === null || _b === void 0 ? void 0 : _b[1];
        const low = (_c = html.match(/html5player\.setVideoUrlLow\('([^']+)'/)) === null || _c === void 0 ? void 0 : _c[1];
        if (hls)
            directLinks.push({ title: "HLS", link: hls, type: "m3u8" });
        if (high)
            directLinks.push({ title: "720p", link: high, type: "mp4" });
        if (low && low !== high)
            directLinks.push({ title: "480p", link: low, type: "mp4" });
        const linkList = directLinks.length
            ? [{ title: "Play", quality: "HD", directLinks }]
            : [{ title: "Play", quality: "HD", directLinks: [{ title: "Play", link, type: "mp4" }] }];
        return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
    }
    catch (_d) {
        return empty;
    }
};
exports.getMeta = getMeta;
