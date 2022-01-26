import request from "../utils/request";
import { PAGE_SIZE } from '@/constants';

export const goods = {
  getGoodsList(page) {
    return request.get(`/api/commodity/personal_list`,{
      params:{
        page: page,
        size: PAGE_SIZE.NORMAL
      }
    });
  },
  getPlayList() {
    return request.get(`/api/play_list`,{
      params: {
        size: PAGE_SIZE.MAX
      }
    });
  },
  getGoodsByPlaylistId(playlistId) {
    return request.get(`/api/play_list/get_commodity`, {
      params: {
        play_list_id: playlistId,
        size: PAGE_SIZE.MAX
      },
    });
  },
  // 创建新商品
  creatNewGoods(image, name, price, introduce) {
    return request.post(`/api/commodity`, {
      image,
      name,
      price,
      introduce,
    });
  },
  // 生成语音
  createVoice(user, {image, name, price, introduce, commodity_id, is_modify = 0}) {
    return request.post(`/api/commodity/commit_commodity_desc`, {
      image,
      name,
      price,
      introduce,
      user,
      commodity_id,
      is_modify
    });
  },
  // 编辑商品
  updateGoods(id, {
    introduce,
    price,
    image,
    name,
    tag_list,
    simple_sentence_id_list
  }) {
    return request.patch(`/api/commodity/${id}`, {
      introduce,
      price,
      image,
      name,
      tag_list,
      simple_sentence_id_list
    })
  },
  getGoodsInfoById(id) {
    return request.get(`/api/commodity/${id}`);
  },
  deleteGoodsById(id) {
    return request.delete(`/api/commodity/${id}`);
  },
  deleteGooodListById(id) {
    return request.delete(`/api/play_list/${id}`);
  },
  createPlayList(name, commodity_list, user) {
    return request.post(`/api/play_list`, {
      name,
      commodity_list,
      user
    });
  },
  updatePlayList(id, name, commodity_list) {
    return request.patch(`/api/play_list/${id}`, {
      name,
      commodity_list,
    });
  },
  // 检测敏感词
  testGoodProhibitedWords(introduce) {
    return request.post(`/api/commodity/test_prohibited_words`, {
      introduce
    });
  }
};