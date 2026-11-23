"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link, type, signal, providerContext, }) {
    var _a, _b;
    if (!link)
        return [];
    const { axios } = providerContext;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://xiaoshenke.net/",
    };
    if (link.includes("xiaoshenke.net")) {
        try {
            // Manual redirect follow to get the final video URL
            let current = link;
            for (let i = 0; i < 5; i++) {
                const res = await axios.get(current, {
                    headers,
                    maxRedirects: 0,
                    signal,
                    timeout: 10000,
                    validateStatus: (s) => s >= 200 && s < 400,
                });
                const loc = ((_a = res.headers) === null || _a === void 0 ? void 0 : _a.location) || ((_b = res.headers) === null || _b === void 0 ? void 0 : _b.Location);
                if (!loc)
                    break;
                current = loc.startsWith("//") ? "https:" + loc : loc.startsWith("/") ? "https://xiaoshenke.net" + loc : loc;
                if (current.includes("/s0/") || current.includes(".mp4"))
                    break;
            }
            if (current !== link) {
                return [{ server: "FullPorner", link: current, type: "mp4", headers }];
            }
        }
        catch (_c) { }
        // Fallback: return original and let player handle redirect
        return [{ server: "FullPorner", link, type: "mp4", headers }];
    }
    return [{ server: "FullPorner", link, type: "mp4", headers: { ...headers, Referer: "https://fullporner.com/" } }];
};
exports.getStream = getStream;
