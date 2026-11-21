"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const BASE = "https://fullporner.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function parse(html, cheerio) {
    const $ = cheerio.load(html || "");
    const posts = [];
    const seen = new Set();
    $("div.video-card").each((_, el) => {
        const $el = $(el);
        const $a = $el.find("div.video-title a, a").first();
        let link = ($a.attr("href") || "").split("?")[0];
        if (!link)
            return;
        if (link.startsWith("/"))
            link = BASE + link;
        if (!link.includes("fullporner.com"))
            return;
        if (seen.has(link))
            return;
        seen.add(link);
        const title = $a.text().trim() || $el.find(".video-title").text().trim() || "Video";
        let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
        if (image.startsWith("//"))
            image = "https:" + image;
        else if (image.startsWith("/"))
            image = BASE + image;
        if (image.includes("data:image"))
            image = "";
        posts.push({ title: title.slice(0, 160), link, image });
    });
    return posts;
}
const getPosts = async function ({ filter, page, providerValue, signal, providerContext, }) {
    try {
        const { axios, cheerio } = providerContext;
        const path = filter || "/home/";
        const url = page > 1 ? `${BASE}${path}?page=${page}` : `${BASE}${path}`;
        const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 25000 });
        return parse(res.data, cheerio);
    }
    catch (_a) {
        return [];
    }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page, providerValue, signal, providerContext, }) {
    try {
        const { axios, cheerio } = providerContext;
        const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}&p=${page || 1}`;
        const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 25000 });
        return parse(res.data, cheerio);
    }
    catch (_a) {
        return [];
    }
};
exports.getSearchPosts = getSearchPosts;
