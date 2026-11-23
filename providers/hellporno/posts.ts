import { Post, ProviderContext } from "../types";
const BASE = "https://hellporno.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "text/html" };
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + "/" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/videos/']").each((_: any, el: any) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || seen.has(link)) return;
      if (link.startsWith("//")) link = "https:" + link;
      else if (link.startsWith("/")) link = BASE + link;
      if (!link.includes("/videos/")) return;
      seen.add(link);
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || "Untitled").trim().slice(0, 120);
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const q = encodeURIComponent(searchQuery).replace(/%20/g, "-");
    const url = BASE + "/search/" + q + "/" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/videos/']").each((_: any, el: any) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || seen.has(link)) return;
      if (link.startsWith("//")) link = "https:" + link;
      else if (link.startsWith("/")) link = BASE + link;
      if (!link.includes("/videos/")) return;
      seen.add(link);
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || "Untitled").trim().slice(0, 120);
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
}
