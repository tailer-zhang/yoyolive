import React, { useState, useCallback } from "react";
import { Button, Select, Input, Switch, Row, Col, message } from "antd";
import { api } from "@/api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const dataPaneFirst = [
  {
    id: 1,
    name: "活跃人数",
  },
  {
    id: 2,
    name: "观看人数",
  },
  {
    id: 3,
    name: "成交金额",
  },
  {
    id: 4,
    name: "下单人数",
  },
];

const dataPaneSec = [
  {
    id: 1,
    name: "礼物",
  },
  {
    id: 2,
    name: "关注",
  },
  {
    id: 3,
    name: "弹幕",
  },
  {
    id: 4,
    name: "进入直播间",
  },
];

const InteractiveSet = () => {
  const dispatch = useDispatch();
  const { isStarted, selectedPlatform, roomId } = useSelector(
    (state) => state.autolive
  );
  const [roomIdError, setRoomIdError] = useState("");

  const platformOpts = [
    { label: "哔哩哔哩", value: "bilibili" },
    { label: "京东", value: "jingdong", disabled: true },
    { label: "抖音", value: "douyin", disabled: true },
    { label: "淘宝", value: "taobao", disabled: true },
  ];

  const handlePlatformChange = useCallback(
    (value) => {
      dispatch.autolive.selectPlatform({ platform: value });
    },
    [dispatch]
  );

  const handleRoomIdChange = useCallback(
    (e) => {
      if (e.target.value === "") {
        setRoomIdError("请输入直播间地址");
      } else {
        setRoomIdError("");
      }
      dispatch.autolive.changeRoomId({ roomId: e.target.value });
    },
    [dispatch]
  );

  const handleOnLiveBtnClick = useCallback(async () => {
    if (!roomId) {
      setRoomIdError("请输入直播间地址");
      return;
    }

    try {
      const res = await api.autolive.getLiveStaus(roomId, selectedPlatform);
      if (res.is_broadcast) {
        setRoomIdError("连接成功");
      } else {
        setRoomIdError("未查找到该直播间");
      }
    } catch (error) {
      setRoomIdError("未查找到该直播间");
    }
  }, [roomId, selectedPlatform]);

  return (
    <div className="interactive-modal px-5 py-4">
      <Row className="mb-4" align="middle">
        <Col span={6}>直播平台:</Col>
        <Col span={18}>
          <Select
            label="直播平台:"
            className="w-full"
            placeholder="请选择直播平台"
            options={platformOpts}
            value={selectedPlatform}
            onChange={handlePlatformChange}
            disabled={isStarted}
          />
        </Col>
      </Row>
      <Row className="mb-4" align="middle">
        <Col span={6}>直播间ID:</Col>
        <Col span={18} className="flex items-center">
          <Input
            className="yoyo-autolive-page__stream-id-input-container flex-1"
            placeholder="请输入直播间ID"
            onChange={handleRoomIdChange}
            suffix={
              <Button type="primary" onClick={handleOnLiveBtnClick}>
                连接
              </Button>
            }
            value={roomId}
            disabled={isStarted}
          />
          {roomIdError ? (
            <div className="text-red-500 ml-2 text-xs absolute top-full">{`*${roomIdError}`}</div>
          ) : (
            ""
          )}
        </Col>
      </Row>
      {/* <h3 className="rounded-full bg-primary text-white px-3 h-8 mb-4 flex items-center">
        查看数据
      </h3>
      <div className="space-y-4 mb-4 pb-4 border-b">
        {dataPaneFirst.map((item) => {
          return (
            <Row key={item.id} justify="space-between" align="middle">
              <Col flex={1}>{item.name}</Col>
              <Col>
                <Switch />
              </Col>
            </Row>
          );
        })}
      </div>
      <div className="space-y-4">
        {dataPaneSec.map((item) => {
          return (
            <Row key={item.id} align="middle">
              <Col flex={1}>{item.name}</Col>
              <Col>
                <Switch />
              </Col>
            </Row>
          );
        })}
      </div> */}
    </div>
  );
};

export default InteractiveSet;
