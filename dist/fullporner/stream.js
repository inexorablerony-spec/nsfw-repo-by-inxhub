"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link, type, signal, providerContext, }) {
    var _a, _b, _c;
    if (!link)
        return [];
    const { axios } = providerContext;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://xiaoshenke.net/",
    };
    // If it's a xiaoshenke redirect, follow it to the final CDN URL
    if (link.includes("xiaoshenke.net")) {
        try {
            const res = await axios.get(link, { headers, maxRedirects: 5, signal, timeout: 15000, validateStatus: () => true });
            const finalUrl = ((_b = (_a = res.request) === null || _a === void 0 ? void 0 : _a.res) === null || _b === void 0 ? void 0 : _b.responseUrl) || ((_c = res.config) === null || _c === void 0 ? void 0 : _c.url) || link;
            if (finalUrl && finalUrl !== link && finalUrl.startsWith("http")) {
                return [{ server: "FullPorner", link: finalUrl, type: "mp4", headers }];
            }
        }
        catch (_d) { }
        return [{ server: "FullPorner", link, type: "mp4", headers }];
    }
    return [{ server: "FullPorner", link, type: "mp4", headers: { ...headers, Referer: "https://fullporner.com/" } }];
};
exports.getStream = getStream;
