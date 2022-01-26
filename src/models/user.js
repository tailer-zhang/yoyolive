import {
  api
} from "../api";
//保存登录信息到本地
const saveLoginInfo = (loginInfo) => {
  localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
};
const saveToken = (token) => {
  localStorage.setItem("token", token);
}
//清除登录信息从本地
const clearLoginInfo = () => {
  localStorage.setItem("loginInfo", '');
  localStorage.setItem("token", '');
  sessionStorage.clear();
};

const initState = {
  token: localStorage.getItem("token") || "",
  loginInfo: localStorage.getItem("loginInfo") || "",
  userInfo: (localStorage.getItem("loginInfo") && JSON.parse(localStorage.getItem("loginInfo"))) || "",
  userFields: []
};

const userModel = {
  state: initState,
  reducers: {
    userLogin(state, payload) {
      state.token = payload.token;
      state.loginInfo = payload;
      saveToken(payload.token)
      saveLoginInfo(payload);
      return state;
    },
    userLoginout(state, payload) {
      clearLoginInfo();
      return state;
    },
    mapUserInfo(state, payload) {
      state.userInfo = payload;
      const list = []
      Object.keys(payload).forEach(key => {
        if (key === "avatar" && payload.avatar) {
          list.push({
            name: [key],
            value: [{
              uid: `${payload?.id}`,
              status: "done",
              url: `${payload?.avatar}`,
            }]
          })
        } else {
          list.push({
            name: key,
            value: payload[key]
          })
        }
      });
      state.userFields = list;
      saveLoginInfo(payload);
      return state;
    },
    updatephone_num(state, payload) {
      state.phone = payload;
      return state;
    }
  },
  effects: (dispatch) => ({
    async getUserInfo(payload, rootState) {
      const res = await api.user.getUserInfo();
      dispatch.user.mapUserInfo(res);
    },
  }),
};

export default userModel;