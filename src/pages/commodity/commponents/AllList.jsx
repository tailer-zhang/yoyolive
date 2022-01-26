import React, { useCallback } from "react";
import { message, Spin, Pagination, Empty } from "antd";
import GridItem from "@/components/GridItem";
import { api } from "@/api";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ReactSortable } from "react-sortablejs";
import { PAGE_SIZE } from "@/constants";
import "../style.less";

const AllList = ({ page, setPage }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const total = useSelector((state) => state.goods.total);
  
  const queryClient = useQueryClient();
  const goodsQueryKey = ["goodsQuery", page];
  const goodListIsFetching = queryClient.isFetching(goodsQueryKey);
  const entities = useSelector((state) => state.goods.entities);
  const goodsListIds = queryClient.getQueryData(goodsQueryKey);
  const deleteGoodsMutation = useMutation(
    async ({ id }) => {
      await api.goods.deleteGoodsById(id);
    },
    {
      onSuccess: (data, { id }) => {
        const lastPage = Math.floor(total / PAGE_SIZE.NORMAL) + 1;
        message.success("删除成功");
        queryClient.setQueriesData(
          {
            predicate: (query) => {
              const result =
                query.queryKey[0] === "goodsQuery" &&
                query.queryKey[1] === lastPage;
              return result;
            },
          },
          (data) => {
            return data.filter((goodsId) => goodsId !== id);
          }
        );
        queryClient.invalidateQueries({
          predicate: (query) => {
            const result =
              query.queryKey[0] === "goodsQuery" &&
              query.queryKey[1] >= page &&
              query.queryKey[1] !== lastPage;
            return result;
          },
        });
        dispatch.goods.setTotal({ total: Math.max(0, total - 1) });
      },
    }
  );

  const handleOnEditBtnClick = useCallback(
    (item) => {
      queryClient.invalidateQueries(["GoodsInfoById", item.id]);
      history.push({
        pathname: `/goodinfo/${item.id}`,
        state: {
          goodsInfo: {
            ...item,
          },
        },
      });
    },
    [history, queryClient]
  );

  const handleOnPaginationChange = (page) => {
    dispatch.goods.changePage({ page });
    setPage(page);
  };

  const listItemRender = (id, index) => {
    const item = entities.goods[id];
    return (
      <li key={item.id}>
        <GridItem
          onEdit={handleOnEditBtnClick.bind(null, item)}
          onDelete={() => deleteGoodsMutation.mutate({ id: item.id })}
          name={item.name}
          imageUrl={item.image}
          price={item.price}
          status={item.status}
        />
      </li>
    );
  };

  return (
    <Spin
      tip={
        deleteGoodsMutation.isLoading ? "删除中。。。" : "商品信息刷新中。。。"
      }
      spinning={deleteGoodsMutation.isLoading || !!goodListIsFetching}
    >
      {Array.isArray(goodsListIds) && goodsListIds.length !== 0 ? '' : <Empty description={"暂无商品"} />}
      <ReactSortable className="goods-grid yoyo-autolive-page__grid mb-8"
        list={Array.isArray(goodsListIds) ? goodsListIds : []}
        setList={(newState) => {}}
        onEnd={e => {
          const { newIndex, oldIndex } = e;
          if (newIndex === oldIndex) return;
          const newArr = Array.from(goodsListIds);
          if (newIndex > oldIndex) {
            newArr.splice(newIndex + 1, 0, newArr[oldIndex]);
            newArr.splice(oldIndex, 1);
          } else {
            newArr.splice(newIndex, 0, newArr[oldIndex]);
            newArr.splice(oldIndex + 1, 1);
          }
          queryClient.setQueryData(goodsQueryKey, newArr)
        }}
        animation={200}
        >
        {Array.isArray(goodsListIds) && goodsListIds.map(listItemRender)}
      </ReactSortable>
      <Pagination
        hideOnSinglePage={true}
        className="flex justify-center"
        current={page}
        total={total}
        pageSize={PAGE_SIZE.NORMAL}
        onChange={handleOnPaginationChange}
      />
    </Spin>
  );
};

export default AllList;
