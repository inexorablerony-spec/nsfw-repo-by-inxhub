"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link, type, signal, providerContext, }) {
    if (!link)
        return [];
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.xvideos.com/",
    };
    const streamType = link.includes(".m3u8") ? "m3u8" : "mp4";
    return [{ server: "XVideos", link, type: streamType, headers }];
};
exports.getStream = getStream;
