import { Post, ProviderContext } from "../types";

const BASE = "https://hellporno.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function parse(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $("a[href*='/videos/'], div.thumb a, .video-item a").each((_: any, el: any) => {
    const $el = $(el);
    let link = ($el.attr("href") || "").split("?")[0];
    if (!link || !link.includes("/videos/")) return;
    if (link.startsWith("/")) link = BASE + link;
    if (!link.includes("hellporno")) return;
    if (seen.has(link)) return;
    seen.add(link);

    const title = $el.attr("title") || $el.find("img").attr("alt") || $el.closest("div").find(".title").text().trim() || "Video";
    let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
    if (image.startsWith("//")) image = "https:" + image;
    else if (image.startsWith("/")) image = BASE + image;
    if (image.includes("data:image") || image.includes("blank")) image = "";

    if (title.length > 2) posts.push({ title: title.slice(0, 160), link, image });
  });

  return posts.slice(0, 40);
}

export const getPosts = async function ({
  filter,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : BASE + "/";
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 25000 });
    return parse(res.data, cheerio);
  } catch {
    return [];
  }
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const q = encodeURIComponent(searchQuery).replace(/%20/g, "-");
    const url = `${BASE}/search/${q}/` + (page > 1 ? `?page=${page}` : "");
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 25000 });
    return parse(res.data, cheerio);
  } catch {
    return [];
  }
};
