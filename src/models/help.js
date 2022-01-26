import { api } from "../api";

const initState = {
  dir:[],
  files: "",
};

const userModel = {
  state: initState,
  reducers: {
    getHelpMenu(state, payload) {
      state = {
        ...state,
        ...payload,
      }
      return state;
    }
  },
};

export default userModel;
