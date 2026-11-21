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
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        const empty = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://neporn.com/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const directLinks = [];
            const seen = {};
            const matches = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
            for (let i = 0; i < matches.length; i++) {
                const clean = matches[i].replace(/&amp;/g, "&");
                if (/preview|thumb/i.test(clean) || seen[clean]) continue;
                if (clean.indexOf("v-acctoken") < 0) continue;
                seen[clean] = true;
                const qm = clean.match(/_(\d+p)\.mp4/i);
                const q = qm ? qm[1] : "480p";
                directLinks.push({ title: q, link: clean, type: "mp4" });
            }
            directLinks.sort(function (a, b) { return parseInt(b.title) - parseInt(a.title); });
            if (directLinks.length === 0) directLinks.push({ title: "Play", link: link, type: "mp4" });
            return { title: title, synopsis: "", image: image, imdbId: "", type: "movie", linkList: [{ title: "Play", quality: (directLinks[0] && directLinks[0].title) || "HD", directLinks: directLinks }] };
        } catch (e) { return empty; }
    });
};
exports.getMeta = getMeta;
