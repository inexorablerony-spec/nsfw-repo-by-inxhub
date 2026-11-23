// @vega-provider pornhat
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.pornhat.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "text/html" };
    const url = BASE + "/" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/video/']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || seen.has(link)) return;
      if (link.startsWith("//")) link = "https:" + link;
      else if (link.startsWith("/")) link = BASE + link;
      if (!link.includes("/video/")) return;
      seen.add(link);
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || "Untitled").trim().slice(0, 120);
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.pornhat.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "text/html" };
    const q = encodeURIComponent(searchQuery).replace(/%20/g, "-");
    const url = BASE + "/search/" + q + "/" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/video/']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || seen.has(link)) return;
      if (link.startsWith("//")) link = "https:" + link;
      else if (link.startsWith("/")) link = BASE + link;
      if (!link.includes("/video/")) return;
      seen.add(link);
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || "Untitled").trim().slice(0, 120);
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
