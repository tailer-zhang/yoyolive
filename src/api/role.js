import request from "../utils/request";

export const role = {
  getRoles() {
    return request.get(`/api/role`);
  },
};
