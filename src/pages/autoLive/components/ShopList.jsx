import React, { useState, useCallback } from "react";
import { Button, Select } from "antd";
import { useQueryClient } from "react-query";
import classnames from "classnames";
import CreateOrEditPlaylistModal from "@/components/createOrEditPlaylistModal";
import GridItem from "@/components/GridItem";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import giftIcon from "@/images/gift.webp";
import { denormalize } from "normalizr";
import { playlistList } from "@/constants/schema";
import { useGetGoodsList } from "@/utils/hooks";

const ShopList = () => {
  const { isStarted, selectedGoodsId, selectedPlaylistId } = useSelector(
    (state) => ({
      isStarted: state.autolive.isStarted,
      selectedGoodsId: state.autolive.selectedGoodsId,
      selectedPlaylistId: state.autolive.selectedPlaylistId,
    })
  );
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const queryClient = useQueryClient();
  const playlistsOriginal = queryClient.getQueryData("playlistQuery");
  const playlists = playlistsOriginal
    ? denormalize(
        playlistsOriginal.result,
        playlistList,
        playlistsOriginal.entities
      )
    : [];

  const goodsInPlaylist = useGetGoodsList([
    "goodsInPlaylistQuery",
    selectedPlaylistId,
  ]);

  const handleChange = async (value) => {
    dispatch.autolive.selectPlaylist({ id: value });
    dispatch.goods.setPlaylistId(value);
    dispatch.autolive.selectGoods({ id: 0 });
  };

  const handleSelectGoods = useCallback(
    (id) => {
      if (id === selectedGoodsId) {
        dispatch.autolive.selectGoods({ id: 0 });
      } else {
        dispatch.autolive.selectGoods({ id });
      }
    },
    [dispatch, selectedGoodsId]
  );

  const listItemRender = (item) => {
    return (
      <li key={item.id}>
        <GridItem
          className={classnames({
            selected: item.id === selectedGoodsId,
          })}
          name={item.name}
          imageUrl={item.image}
          isShowhoverButton={false}
          onClick={() => handleSelectGoods(item.id)}
        />
      </li>
    );
  };

  const playlistSelectOpts = playlists.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const selectedPlaylist = get(
    playlistsOriginal,
    `entities.playlist['${selectedPlaylistId}']`,
    {}
  );

  return (
    <div className="yoyo-autolive-page__goods-list-pane px-5 py-4 overflow-y-hidden h-full flex flex-col">
      <div className="flex w-full justify-between mb-4">
        <Select
          disabled={isStarted}
          placeholder="请选择播放列表"
          className="flex-1"
          onChange={handleChange}
          value={selectedPlaylist.id}
          options={playlistSelectOpts}
          optionFilterProp="children"
        />
        <Button
          className="ml-2"
          type="primary"
          onClick={() => setVisible(true)}
        >
          添加播放列表
        </Button>
      </div>
      {!Array.isArray(goodsInPlaylist) || goodsInPlaylist.length === 0 ? (
        <div className="mt-32 mx-auto text-center flex flex-col items-center">
          <img src={giftIcon} alt="" />
          <div className="text-xs mt-5">暂无商品数据</div>
        </div>
      ) : (
        <ul className="yoyo-autolive-page__goods-list yoyo-autolive-page__grid overflow-y-auto">
          {goodsInPlaylist && goodsInPlaylist.map(listItemRender)}
        </ul>
      )}
      <CreateOrEditPlaylistModal
        visible={visible}
        title="添加播放列表"
        onClose={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        isCreate
      />
    </div>
  );
};

export default ShopList;
