"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
    if (!link)
        return [];
    return [{ server: "SpankBang", link, type: link.includes(".m3u8") ? "m3u8" : "mp4", headers: { Referer: "https://spankbang.com/" } }];
};
exports.getStream = getStream;
