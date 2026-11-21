import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "WatchPorn", link, type: "mp4", headers: { Referer: "https://watchporn.to/", "User-Agent": "Mozilla/5.0" } }];
};
