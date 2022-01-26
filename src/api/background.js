import request from "../utils/request";

export const background = {
  getBackgrounds() {
    return request.get(`/api/background`);
  },
  selectBackground() {
    return request.post(`/api/background/add_background`, {
      image,
    });
  },
  handleSelectBg(image) {
    return request.post(`/api/background/add_background`, {
      image,
    });
  },
};
