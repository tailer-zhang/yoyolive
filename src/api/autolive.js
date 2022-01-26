import request from "../utils/request";

export const autolive = {
  getLiveStaus(roomId, platform) {
    return request.get(`/api/commodity/get_live_status`, {
      params: {
        room_id: roomId,
        platform: platform,
      },
    });
  },
  postLiveTime(date, interval = 1000 * 60) {
    return request.post(`/api/play_list/add_running_time`, {
      date: date,
      interval: interval,
    });
  },
};
