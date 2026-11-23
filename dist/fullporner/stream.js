"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link, type, signal, providerContext, }) {
    if (!link)
        return [];
    // Return the xiaoshenke link directly — the player will follow the 302
    // Final CDN URL is short-lived; better to let the player resolve it
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://xiaoshenke.net/",
        Origin: "https://xiaoshenke.net",
    };
    return [{ server: "FullPorner", link, type: "mp4", headers }];
};
exports.getStream = getStream;
