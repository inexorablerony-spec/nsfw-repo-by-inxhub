import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "PornMike", link, type: "mp4", headers: { Referer: "https://www.pornmike.com/", "User-Agent": "Mozilla/5.0" } }];
};
