// @vega-provider spankbang
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  if (!/\.(mp4|m3u8)/i.test(link)) return [];
  return [{ server: "spankbang", link, type: link.includes(".m3u8") ? "m3u8" : "mp4", headers: { Referer: "https://spankbang.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
