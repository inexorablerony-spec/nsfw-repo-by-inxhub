import { Stream } from "../types";
export const getStream = async function ({ link }: any): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "PornHat", link, type: "mp4", headers: { Referer: "https://www.pornhat.com/" } }];
};
