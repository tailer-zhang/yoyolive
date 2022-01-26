import request from "../utils/request";

export const playlist = {
  getPlaylists() {
    return request.get(`/api/play_list`);
  },
};
