import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "Neporn", link, type: "mp4", headers: { Referer: "https://neporn.com/", "User-Agent": "Mozilla/5.0" } }];
};
