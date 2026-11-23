import { Post, ProviderContext } from "../types";

const BASE = "https://spankbang.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function parse(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $("div.video-item, div.thumb, a[href*='/video/']").each((_: any, el: any) => {
    const $el = $(el);
    const $a = $el.is("a") ? $el : $el.find("a").first();
    let link = ($a.attr("href") || "").split("?")[0];
    if (!link || !link.includes("/")) return;
    if (link.startsWith("/")) link = BASE + link;
    if (!link.includes("spankbang.com")) return;
    if (seen.has(link)) return;
    seen.add(link);

    const title = $a.attr("title") || $el.find(".title, .video-title").text().trim() || $a.text().trim() || "Video";
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
    const path = filter || "/";
    const url = page > 1 ? `${BASE}${path}${path.endsWith("/") ? "" : "/"}page/${page}/` : `${BASE}${path}`;
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
    const url = `${BASE}/s/${encodeURIComponent(searchQuery)}/${page || 1}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 25000 });
    return parse(res.data, cheerio);
  } catch {
    return [];
  }
};
