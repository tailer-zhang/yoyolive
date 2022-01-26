import request from "../utils/request";

export const help = {
  handleFeedback(user, text, images) {
    return request.post(`/api/feedback`, {
      user,
      text,
      images,
    });
  },
  searchHelp(search, size, page){
    return request.get(`/api/help-document?search=${search}&page=${page}&size=${size}`);
  },
  getHelpMenu() {
    return request.get(`/api/help-document/menu`);
  },
  getUpdate() {
    return request.get('http://127.0.0.1:4004/index.json');
  }
};
