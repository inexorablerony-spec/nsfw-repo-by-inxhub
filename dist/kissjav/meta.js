"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
function b64decode(s) {
    try {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let output = "";
        let i = 0;
        s = s.replace(/[^A-Za-z0-9+/=]/g, "");
        while (i < s.length) {
            const enc1 = chars.indexOf(s.charAt(i++));
            const enc2 = chars.indexOf(s.charAt(i++));
            const enc3 = chars.indexOf(s.charAt(i++));
            const enc4 = chars.indexOf(s.charAt(i++));
            const chr1 = (enc1 << 2) | (enc2 >> 4);
            const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            const chr3 = ((enc3 & 3) << 6) | enc4;
            output += String.fromCharCode(chr1);
            if (enc3 !== 64) output += String.fromCharCode(chr2);
            if (enc4 !== 64) output += String.fromCharCode(chr3);
        }
        return output;
    } catch (e) { return ""; }
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        const empty = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://kissjav.li/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const directLinks = [];
            const b64Match = html.match(/video_url:\s*['"]([A-Za-z0-9+/=]+)['"]/);
            if (b64Match) {
                const decoded = b64decode(b64Match[1]);
                if (decoded && decoded.indexOf("get_file") >= 0) {
                    directLinks.push({ title: "HD", link: decoded, type: "mp4" });
                }
            }
            if (directLinks.length === 0) directLinks.push({ title: "Play", link: link, type: "mp4" });
            return { title: title, synopsis: "", image: image, imdbId: "", type: "movie", linkList: [{ title: "Play", quality: "HD", directLinks: directLinks }] };
        } catch (e) { return empty; }
    });
};
exports.getMeta = getMeta;
