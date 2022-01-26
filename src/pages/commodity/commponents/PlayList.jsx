import React from "react";
import { message, Spin, Empty } from "antd";
import { api } from "@/api";
import { useQueryClient, useMutation } from "react-query";
import GridItem from "@/components/GridItem";
import { playlistList } from "@/constants/schema";
import { denormalize } from "normalizr";

const PlayList = ({ onEditPlaylist }) => {
  const queryClient = useQueryClient();
  const playlistsOriginal = queryClient.getQueryData("playlistQuery");
  const playListIsFetching = queryClient.isFetching("playlistQuery");
  const playlists = playlistsOriginal
    ? denormalize(
        playlistsOriginal.result,
        playlistList,
        playlistsOriginal.entities
      )
    : [];

  const deletePlaylistByIdAsync = async (id) => {
    return api.goods.deleteGooodListById(id);
  };

  const deletePlaylistByIdMutation = useMutation(deletePlaylistByIdAsync, {
    onSuccess: (data, id) => {
      message.success("删除成功");
      queryClient.setQueryData("playlistQuery", (data) => {
        const b = { ...data.entities.playlist };
        delete b[id];
        const newData = {
          entities: {
            playlist: b,
          },
          result: data.result.filter((playlistId) => playlistId !== id),
        };
        return newData;
      });
    },
  });

  const handleOnDelete = async (item) => {
    deletePlaylistByIdMutation.mutate(item.id);
  };

  const handleOnEdit = (item) => {
    onEditPlaylist(item);
  };

  const listItemRender = (item, index) => {
    return (
      <li key={item.id}>
        <GridItem
          name={item.name}
          imageUrl={item.cover_image}
          onEdit={handleOnEdit.bind(null, item, index)}
          onDelete={handleOnDelete.bind(null, item)}
        />
      </li>
    );
  };

  return (
    <Spin
      tip={
        deletePlaylistByIdMutation.isLoading
          ? "删除中。。。"
          : "播放列表刷新中。。。"
      }
      spinning={deletePlaylistByIdMutation.isLoading || !!playListIsFetching}
    >
      {playlists.length === 0 ? <Empty description={"暂无播放列表"} /> : ''}
      <div className="goodslist_modal">
        <ul className="yoyo-autolive-page__playlist-list yoyo-autolive-page__grid">
          {playlists && playlists.map(listItemRender)}
        </ul>
      </div>
    </Spin>
  );
};

export default PlayList;
