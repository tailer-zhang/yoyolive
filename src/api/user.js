import request from "../utils/request";

export const user = {
  loginByCode(phone_num, code) {
    let url = "/api/auth/sign";
    return request.post(url, {
      phone_num,
      code,
    });
  },
  loginByPwd(phone_num, pwd) {
    let url = "/api/auth/pwd_sign_in";
    return request.post(url, {
      phone_num,
      password: pwd,
    });
  },
  resetPwd(phone_num, code, password) {
    return request.post(`/api/auth/reset`, {
      phone_num: phone_num,
      code,
      new_password: password,
    });
  },
  resetphone_num(phone_num, phone_num_new, code_new) {
    return request.post(`/api/auth/reset_phone_num`, {
      phone_num: phone_num,
      new_phone_num: phone_num_new,
      code: code_new,
    });
  },
  checkphone_num(phone_num, code) {
    return request.post(`/api/auth/check_phone`, {
      phone_num: phone_num,
      code,
    });
  },
  getUserInfo() {
    return request.get(`/api/user/profile`);
  },
  getUserProfile() {
    return request.get(`/api/user/profile`);
  },
  sendSMS(phone_num, usage){
    return request.post('/api/common/send-sms', {
      phone_num: phone_num,
      sms_use: usage
    })
  },
  updateUserInfo(avatar, nickname, name, org_name) {
    return request.post(`/api/user/update_profile`, {
      avatar,
      name,
      nickname,
      org_name,
    });
  },
};
