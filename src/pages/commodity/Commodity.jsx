import React, { useState, useEffect } from "react";
import { Button, Tabs, Space } from "antd";
import CreateOrEditPlaylistModal from "@/components/createOrEditPlaylistModal";
import AllList from "./commponents/AllList";
import PlayList from "./commponents/PlayList";
import { SyncOutlined } from "@ant-design/icons";
import { useQueryClient } from "react-query";
import "./style.less";
import { Link, Route, Switch } from "react-router-dom";
import { get } from "lodash";
import { useDispatch } from "react-redux";

const { TabPane } = Tabs;

const Commodity = () => {
  const [activeKey, setActiveKey] = useState("all");
  const [page, setPage] = useState(1);
  const [isCreate, setIsCreate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(0);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const playlistsOriginal = queryClient.getQueryData("playlistQuery");

  const refreshing = () => {
    if (activeKey === "all") {
      queryClient.refetchQueries(["goodsQuery", page]);
    } else {
      queryClient.refetchQueries("playlistQuery");
    }
  };
  useEffect(() => {
    refreshing();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);
  const handleOnCreatePlaylist = (item) => {
    setIsCreate(true);
    setVisible(true);
  };

  const onEditPlaylist = (item) => {
    setVisible(true);
    setIsCreate(false);
    setSelectedPlaylistId(item.id);
    dispatch.goods.setPlaylistId(item.id);
  };

  const selectedPlaylist = get(
    playlistsOriginal,
    `entities.playlist['${selectedPlaylistId}']`,
    {}
  );

  const onTabRender = (props, DefaultTabBar) => {
    return (
      <div className="flex items-center sticky top-0">
        <DefaultTabBar {...props} />
        <div className="flex-1"></div>
        <Space>
          <Button icon={<SyncOutlined />} onClick={() => refreshing()}>
            刷新
          </Button>
          {activeKey === "all" ? (
            <Button type="primary">
              <Link to="/goodinfo">新增商品</Link>
            </Button>
          ) : (
            <Button type="primary" onClick={handleOnCreatePlaylist}>
              新增播放列表
            </Button>
          )}
        </Space>
      </div>
    );
  };

  const handleOnActiveTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div className="w-full h-full px-7 bg-white">
      <div>
        <Tabs
          renderTabBar={onTabRender}
          activeKey={activeKey}
          onChange={handleOnActiveTabChange}
        >
          <TabPane tab="所有商品" key="all">
            <AllList page={page} setPage={setPage} />
          </TabPane>
          <TabPane tab="播放列表" key="playList">
            <PlayList onEditPlaylist={onEditPlaylist} />
          </TabPane>
        </Tabs>
      </div>
      <CreateOrEditPlaylistModal
        visible={visible}
        onClose={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        playlist={selectedPlaylist}
        isCreate={isCreate}
      />
    </div>
  );
};

export default Commodity;
