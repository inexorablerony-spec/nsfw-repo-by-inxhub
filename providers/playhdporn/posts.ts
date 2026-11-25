import { Post, ProviderContext } from "../types";
const BASE = "https://playhdporn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function parse(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $("a.drop-card, a[href*='/video/']").each((_: any, el: any) => {
    const $el = $(el);
    let link = ($el.attr("href") || "").split("?")[0];
    if (!link || !link.includes("/video/")) return;
    if (link.startsWith("/")) link = BASE + link;
    if (seen.has(link)) return;
    seen.add(link);

    const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
    let image = $el.find("img").attr("data-original") || $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
    if (image.startsWith("//")) image = "https:" + image;
    else if (image.startsWith("/")) image = BASE + image;
    if (image.includes("data:image") || image.includes("blank") || image.includes("gif")) image = "";

    if (title.length > 2) posts.push({ title: title.slice(0, 160), link, image });
  });

  return posts.slice(0, 40);
}

export const getPosts = async function ({ page, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/latest-updates/?page=${page}` : `${BASE}/latest-updates/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return parse(res.data, cheerio);
  } catch { return []; }
};

export const getSearchPosts = async function ({ searchQuery, page, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search/?q=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return parse(res.data, cheerio);
  } catch { return []; }
};
