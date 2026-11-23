// @vega-provider spankbang
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://spankbang.com";
    const res = await axios.get(BASE + "/?page=" + page, { headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE + "/" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href]").each((_, el) => {
      let href = $(el).attr("href") || "";
      const match = href.match(/^\/?([a-z0-9]+)\/video(?:\/([^?#]+))?/i);
      if (!match) return;
      const link = BASE + "/" + match[1] + "/video/" + (match[2] || "");
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title && title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://spankbang.com";
    const res = await axios.get(BASE + "/s/" + encodeURIComponent(searchQuery) + "/?page=" + page, { headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE + "/" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href]").each((_, el) => {
      let href = $(el).attr("href") || "";
      const match = href.match(/^\/?([a-z0-9]+)\/video(?:\/([^?#]+))?/i);
      if (!match) return;
      const link = BASE + "/" + match[1] + "/video/" + (match[2] || "");
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title) posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
