import {RESOLUTION_LEVEL} from '../constants'

const initState = {
  isStarted: false,
  selectedRoleIndex: 0,
  selectedPlaylistId: 0,
  selectedPlaylistIndex: -1,
  selectedGoodsId: 0,
  selectedBackdropIndex: 0,
  activeRoleTabKey: 'buildinRole',
  selectedPlatform: null,
  roomId: '',
  resolution: RESOLUTION_LEVEL.MEDIUM
};

const autoliveModel = {
  state: initState,
  reducers: {
    startLive(state, payload) {
      state.isStarted = true;
      return state;
    },
    stopLive(state, payload) {
      state.isStarted = false;
      return state;
    },
    selectPlaylist(state, payload) {
      if(state.isStarted){
        return state;
      }
      state.selectedPlaylistId = payload.id;
      state.selectedPlaylistIndex = payload.index;
      return state;
    },
    selectGoods(state, payload) {
      if(state.isStarted){
        return state;
      }
      state.selectedGoodsId = payload.id;
      return state;
    },
    selectRole(state, payload) {
      if(state.isStarted){
        return state;
      }
      state.selectedRoleIndex = payload.index;
      return state;
    },
    selectBackdrop(state, payload) {
      if(state.isStarted){
        return state;
      }
      state.selectedBackdropIndex = payload.index;
      return state;
    },
    selectPlatform(state, payload) {
      if(state.isStarted){
        return state;
      }
      state.selectedPlatform = payload.platform;
      return state;
    },
    changeRoomId(state, payload) {
      if(state.isStarted){
        return state;
      }
      state.roomId = payload.roomId;
      return state;
    },
    changeResolution(state, payload) {
      if(state.isStarted){
        return state;
      }
      state.resolution = payload.resolution;
      return state;
    },
    changeActiveRoleTab(state, payload) {
      state.activeRoleTabKey = payload;
      return state;
    },
    clear(state, payload) {
      state = initState;
      return state;
    },
  },
  effects: (dispatch) => ({
  }),
}

export default autoliveModel;
