import { Stream } from "../types";
export const getStream = async function ({ link }: any): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "HellPorno", link, type: link.includes(".m3u8") ? "m3u8" : "mp4", headers: { Referer: "https://hellporno.com/" } }];
};
