import goods from "../images/goods.png";
import help from "../images/help.png";
import playvideo from "../images/playvideo.png";
import setting from "../images/setting.png";
import user from "../images/user.png";

const menuList = [
  {
    title: "自动直播",
    key: "/autolive/playlist",
    icon: playvideo,
  },
  {
    title: "商品管理",
    key: "/goods",
    icon: goods,
  },
  {
    title: "用户中心",
    key: "/user",
    icon: user,
  },
  {
    title: "系统设置",
    key: "/system",
    icon: setting,
  },
  {
    title: "帮助",
    key: "/help",
    icon: help,
  },
];

export default menuList;
