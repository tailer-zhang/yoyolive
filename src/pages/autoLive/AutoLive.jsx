import React, { useRef, useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import LiveRoute from "./components/LiveRoute";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useInterval } from "react-use";
import { useGetGoodsList } from "@/utils/hooks";
import { api } from "@/api";
import { get } from "lodash";
import { Button, message, Modal, Checkbox, Tooltip } from "antd";
import AutoSizer from "react-virtualized-auto-sizer";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { FixedSizeList as List } from "react-window";
import messageIcon from "@/images/messages.webp";
import bgPreviewDefault from "@/images/bg-preview-default.jpg";
import wechatQRcodeImage from "@/images/wechat-QRcode.jpg";
import "./style.less";
function MessageItem({ data, index, style }) {
  return <div style={style}>{data[index]}</div>;
}

export const LivePlatform = {
  bilibili: "bilibili",
  jingdong: "jingdong",
};

// 本地视频处理服务器的 url,
const localServerUrl = process.env.REACT_APP_LOCAL_SERVER_URL;
const danmuApiBaseUrl = process.env.REACT_APP_DANMU_API_BASEURL;

const MAX_FREE_LIVE_SHOW_TIME = parseInt(
  process.env.REACT_APP_MAX_FREE_LIVE_SHOW_TIME,
  10
);
const LIVE_TIME_REPORT_INTERVAL =
  parseInt(process.env.REACT_APP_LIVE_TIME_REPORT_INTERVAL, 10) || 1000 * 60;

const getDanmuUrl = (platform, roomId) => {
  switch (platform) {
    case LivePlatform.bilibili:
      return `${danmuApiBaseUrl}/bilibili_danmu/${roomId}`;
    case LivePlatform.jingdong:
      return `${danmuApiBaseUrl}/jingdong_danmu/${roomId}`;
    default:
      return "";
  }
};

const AutoLive = () => {
  const {
    activeRoleTabKey,
    selectedPlaylistId,
    selectedGoodsId,
    selectedRoleIndex,
    selectedBackdropIndex,
    selectedPlatform,
    roomId,
    isStarted,
    resolution,
    goodsEntities,
  } = useSelector((state) => ({
    ...state.autolive,
    goodsEntities: state.goods.entities,
  }));
  const [msgs, setMsgs] = useState([]);
  const prevState = useRef({ url: "", isStarted: false });
  const dispatch = useDispatch();
  const listRef = useRef();
  const history = useHistory();
  const wsClientRef = useRef(null);
  const [isReportingLivingTime, setIsReportingLivingTime] = useState();

  const queryClient = useQueryClient();
  const goodsInPlaylist = useGetGoodsList([
    "goodsInPlaylistQuery",
    selectedPlaylistId,
  ]);

  const msgsLength = msgs.length;
  // 弹幕消息列表的长度变化后，将滚动条滚动到最后一个列表项
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(msgsLength);
    }
  }, [msgsLength]);

  // 获取被选中的角色
  const getSelectedRole = (selectedRoleIndex) => {
    const buildinRoles = queryClient.getQueryData(["buildinRolesQuery"]) || [];
    const customRoles = queryClient.getQueryData(["customRolesQuery"]) || [];
    const selectedRole = get(
      activeRoleTabKey === "buildinRole" ? buildinRoles : customRoles,
      `[${selectedRoleIndex}]`
    );
    return selectedRole;
  };

  // 获取被选中的商品
  const getSelectedGoods = (selectedGoodsId) => {
    const selectedGoods = get(goodsEntities, `goods['${selectedGoodsId}']`);
    return selectedGoods;
  };

  // 获取被选中的背景图片
  const getSelectedBackdrops = (selectedBackdropIndex) => {
    const backdrops = queryClient.getQueryData(["backdropsQuery"]) || [];
    const selectedBackdrops = get(backdrops, `[${selectedBackdropIndex}]`);
    return selectedBackdrops;
  };

  const selectedRole = getSelectedRole(selectedRoleIndex);
  const selectedGoods = getSelectedGoods(selectedGoodsId);
  const selectedBackdrops = getSelectedBackdrops(selectedBackdropIndex);

  // 连接视频处理服务器
  const connectVideoProcess = useCallback(() => {
    const initLive = (client, { goodsInPlaylist }) => {
      const initParams = goodsInPlaylist.map((good) => ({
        action_tag_list: good.action_tag_list,
        word_list: good.word_list,
        wav_url_list: good.wav_url_list,
        image: good.image,
      }));

      const initParamsStringified = JSON.stringify(initParams);
      const sequenceCommand = `sequence->${initParamsStringified}`;
      client.send(sequenceCommand);
    };

    if (!localServerUrl) {
      return null;
    }

    const { localServerWsClient } = window;
    if (localServerWsClient) {
      initLive(localServerWsClient, {
        goodsInPlaylist: goodsInPlaylist,
      });
    } else {
      const client = new W3CWebSocket(localServerUrl);
      client.onerror = function (error) {
        message.error("程序尚未启动完毕，请稍等重试");
        console.log("Connection Error", error);
        window.ipcRenderer.send("START_VIDEO_PROCESS", false);
      };
      client.onopen = () => {
        message.success("连接本地视频服务成功");
        let bg = `../app.asar.unpacked${selectedBackdrops ? selectedBackdrops.image : bgPreviewDefault}`;
        if (process.env.NODE_ENV === "development") {
          bg = `../build${selectedBackdrops ? selectedBackdrops.image : bgPreviewDefault}`
        }
        const startParams = {
          bg,
          clarity: resolution,
        };
        const startCommand = `start->${JSON.stringify(startParams)}`;
        console.log("startCommand", startCommand)
        client.send(startCommand);
        initLive(client, { goodsInPlaylist: goodsInPlaylist });
        window.localServerWsClient = client;
      };

      client.onclose = function () {
        // message.info("关闭和本地服务的 websocket 连接");
        dispatch.autolive.stopLive();
        console.log("echo-protocol Client Closed");
        delete window.localServerWsClient;
      };
    }
  }, [dispatch, goodsInPlaylist, selectedBackdrops, resolution]);

  // 断开连接视频处理服务器
  const disconnectVideoProcess = useCallback(() => {
    const client = window.localServerWsClient;
    if (client) {
      client.send("stop->{}");
    }
  }, []);

  // 根据 isStarted 状态的变化，连接或断开与视频处理服务器的 websocket连接
  useEffect(() => {
    if (prevState.current.isStarted !== isStarted) {
      if (isStarted) {
        connectVideoProcess();
      } else {
        disconnectVideoProcess();
      }
      prevState.current.isStarted = isStarted;
    }
  }, [isStarted, connectVideoProcess, disconnectVideoProcess]);

  // 报告直播时长
  const reportLiveTime = async (interval) => {
    // try {
    //   const date = dayjs().format("YYYY-MM-DD");
    //   const { running_time } = await api.autolive.postLiveTime(date, interval);
    //   if (Number(running_time) > MAX_FREE_LIVE_SHOW_TIME) {
    //     Modal.info({
    //       content: (
    //         <div className="text-center">
    //           您的免费直播时长已耗尽，
    //           <br />
    //           联系客服立刻解锁24小时自动播
    //           <img
    //             className="block mx-auto mt-4 h-96"
    //             src={wechatQRcodeImage}
    //             alt=""
    //           />
    //         </div>
    //       ),
    //     });
    //     return false;
    //   }
    // } catch (error) {
    //   message.info(error.message);
    // }
    return true;
  };

  // 每隔一分钟向服务器发送一次请求，接口返回对应日期使用的分钟数，如果超过设定的分钟数，则停止直播
  // useInterval(
  //   async () => {
  //     if (!(await reportLiveTime(LIVE_TIME_REPORT_INTERVAL))) {
  //       dispatch.autolive.stopLive();
  //       setIsReportingLivingTime(false);
  //     }
  //   },
  //   isReportingLivingTime ? LIVE_TIME_REPORT_INTERVAL : null
  // );

  // 与弹幕服务器建立 websocket 的连接
  const connectToDanmuWebsocket = useCallback(() => {
    const url = getDanmuUrl(selectedPlatform, roomId);
    if (!wsClientRef.current && url) {
      const client = new W3CWebSocket(url);

      client.onerror = function (error) {
        // message.error("");
        console.log("Connection Error", error);
      };

      client.onopen = () => {
        console.log("websocket链接成功");
      };

      client.onmessage = (message) => {
        setMsgs((msgs) => [...msgs, message.data]);
        if (window.localServerWsClient) {
          window.localServerWsClient.send(message.data);
        }
      };

      client.onclose = function (e) {
        console.log("echo-protocol Client Closed");
      };

      wsClientRef.current = client;
    }
  }, [selectedPlatform, roomId]);

  // 断开与弹幕服务器建立的 websocket 连接
  const unconnectToDanmuWebsocket = useCallback(() => {
    if (
      wsClientRef.current &&
      typeof wsClientRef.current.close === "function"
    ) {
      wsClientRef.current.close();
      wsClientRef.current = null;
    }
  }, []);

  // 连接到弹幕
  useEffect(() => {
    if (!wsClientRef.current && isStarted) {
      connectToDanmuWebsocket();
    }

    return unconnectToDanmuWebsocket;
  }, [isStarted, connectToDanmuWebsocket, unconnectToDanmuWebsocket]);

  // 弹幕清除
  useEffect(() => {
    const url = getDanmuUrl(selectedPlatform, roomId);
    if (isStarted !== prevState.isStarted && isStarted) {
      // 开始直播之后对比当前的 url 和上次开始直播的 url，如果不同则清除弹幕消息列表
      if (prevState.current.url !== url) {
        setMsgs([]);
        // 保存本次开始直播使用的 url
        prevState.current.url = url;
      }
    }
  }, [selectedPlatform, roomId, isStarted]);

  // 点击开始直播
  const handleLiveStart = async () => {
    if (isStarted) {
      Modal.confirm({
        content: "您确定要暂停直播吗？",
        onOk: () => {
          dispatch.autolive.stopLive();
        },
      });
    } else {
      if (!selectedPlaylistId) {
        message.info("请选择播放列表", 0.5, () => {
          history.push("/autolive/playlist");
        });
      } else {
        // window.ipcRenderer.invoke('openvedio');
        if (await reportLiveTime(0)) {
          dispatch.autolive.startLive();
          setIsReportingLivingTime(true);
        }
      }
    }
  };

  return (
    <div className="yoyo-autolive-page">
      <section className="yoyo-autolive-page__left-col overflow-y-hidden">
        <LiveRoute />
      </section>
      <section className="yoyo-autolive-page__mid-col flex items-center flex-col justify-between p-4">
        <div
          className="live-preview-container bg-no-repeat bg-center relative"
          style={{
            backgroundImage: `url(${
              selectedBackdrops ? selectedBackdrops.image : bgPreviewDefault
            })`,
          }}
        >
          <img
            src={selectedRole?.image}
            alt=""
            className="live-preview-container__role-image absolute bottom-0 left-1/2 transform -translate-x-1/2"
          />
          {selectedGoods ? (
            <div className="live-preview-container__goods-info-container">
              <div
                className="live-preview-container__goods-image"
                style={{
                  backgroundImage: `url(${selectedGoods?.image})`,
                }}
              ></div>
            </div>
          ) : null}
        </div>
        <div className="w-full flex justify-center items-center" style={{ zIndex: 11 }}>
          <Button className="w-28" type="primary" onClick={handleLiveStart}>
            {isStarted ? "停止直播" : "开始直播"}
          </Button>
        </div>
      </section>
      <section className="yoyo-autolive-page__right-col flex flex-col p-3">
        <h2 className="border-b pb-3">直播间互动</h2>
        <div className="flex-1">
          {!Array.isArray(msgs) || msgs.length === 0 ? (
            <div className="mt-32 mx-auto text-center flex flex-col items-center">
              <img src={messageIcon} alt="" />
              <div className="text-xs mt-5">暂无互动数据</div>
            </div>
          ) : (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={listRef}
                  className="List"
                  itemCount={msgs.length}
                  itemSize={35}
                  itemData={msgs}
                  height={height}
                  width={width}
                >
                  {MessageItem}
                </List>
              )}
            </AutoSizer>
          )}
        </div>
      </section>
    </div>
  );
};

export default AutoLive;
