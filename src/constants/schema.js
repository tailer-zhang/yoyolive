import { schema } from "normalizr";

export const goods = new schema.Entity("goods");
export const goodsList = new schema.Array(goods);
export const role = new schema.Entity("role");
export const roleList = new schema.Array(role);
export const backdrop = new schema.Entity("backdrop");
export const backdropList = new schema.Array(backdrop);
export const playlist = new schema.Entity("playlist");
export const playlistList = new schema.Array(playlist);