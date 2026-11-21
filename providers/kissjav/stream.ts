import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "KissJav", link, type: "mp4", headers: { Referer: "https://kissjav.li/", "User-Agent": "Mozilla/5.0" } }];
};
