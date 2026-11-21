"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link, type, signal, providerContext, }) {
    if (!link)
        return [];
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://xiaoshenke.net/",
    };
    // Direct xiaoshenke links are already the video
    if (link.includes("xiaoshenke.net")) {
        return [{ server: "FullPorner", link, type: "mp4", headers }];
    }
    return [{ server: "FullPorner", link, type: "mp4", headers: { ...headers, Referer: "https://fullporner.com/" } }];
};
exports.getStream = getStream;
