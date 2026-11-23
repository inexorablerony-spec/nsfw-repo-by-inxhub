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
        const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://hellporno.com/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const links = [];
            const seen = new Set();
            // get_file pattern
            const gf = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
            for (const u of gf) {
                const clean = u.replace(/&amp;/g, "&");
                if (seen.has(clean))
                    continue;
                seen.add(clean);
                links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: clean, type: "movie" }] });
            }
            // generic mp4
            const mp4 = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
            for (const u of mp4.slice(0, 3)) {
                const clean = u.replace(/&amp;/g, "&");
                if (seen.has(clean) || /thumb|preview|sprite/i.test(clean))
                    continue;
                seen.add(clean);
                links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: clean, type: "movie" }] });
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
        }
        catch (_b) {
            return empty;
        }
    });
};
exports.getMeta = getMeta;
