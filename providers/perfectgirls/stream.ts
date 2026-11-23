import { Stream } from "../types";
export const getStream = async function ({ link }: any): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "PerfectGirls", link, type: "mp4", headers: { Referer: "https://www.perfectgirls.net/" } }];
};
