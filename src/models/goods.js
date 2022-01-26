const initState = {
  page: 1,
  total: 0,
  entities: {},
  playlistId: 0,
};

const goodsModel = {
  state: initState,
  reducers: {
    changePage: (state, payload) => {
      state.page = payload.page;
      return state;
    },
    setTotal: (state, payload) => {
      state.total = payload.total;
      return state;
    },
    setPlaylistId: (state, payload) => {
      state.playlistId = payload;
      return state;
    },
    addGoodsEntities: (state, payload) => {
      const { entities:{goods} } = payload;
      state.entities.goods = {
        ...state.entities.goods,
        ...goods,
      };
      return state;
    },
  },
  effects: (dispatch) => ({}),
};

export default goodsModel;
