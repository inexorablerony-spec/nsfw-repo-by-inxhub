"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext, }) {
    const empty = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
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
        const iframeUrl = $("iframe").first().attr("src") || "";
        const directLinks = [];
        const m = iframeUrl.match(/\/(?:video|player)\/([^/]+)\/(\d+)/);
        if (m) {
            const reversedId = m[1].split("").reverse().join("");
            const flag = parseInt(m[2], 10);
            const map = [[1, "360p", 360], [2, "480p", 480], [4, "720p", 720], [8, "1080p", 1080]];
            for (const [bit, label, q] of map) {
                if (flag & bit) {
                    directLinks.push({
                        title: label,
                        link: `https://xiaoshenke.net/vid/${reversedId}/${q}`,
                        type: "mp4",
                    });
                }
            }
        }
        const linkList = directLinks.length
            ? [{ title: "Play", quality: "HD", directLinks }]
            : [{ title: "Play", quality: "HD", directLinks: [{ title: "Play", link, type: "mp4" }] }];
        return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
    }
    catch (_a) {
        return empty;
    }
};
exports.getMeta = getMeta;
