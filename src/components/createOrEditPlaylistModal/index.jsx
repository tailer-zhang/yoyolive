import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import {
  Button,
  Form,
  Input,
  Checkbox,
  Modal,
  message,
  Pagination,
} from "antd";
import GridItem from "@/components/GridItem";
import { api } from "@/api";
import { useQueryClient, useMutation } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { useGetGoodsList } from "@/utils/hooks";
import { PAGE_SIZE } from "@/constants";
import "./style.less";
import { isEmpty } from "lodash";

CreateOrEditPlaylistModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  playlist: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  isCreate: PropTypes.bool,
};

function CreateOrEditPlaylistModal({
  visible,
  onCancel,
  onClose,
  playlist,
  isCreate,
}) {
  const [page, setPage] = useState(1);
  const { userId, total } = useSelector((state) => ({
    userId: state.user.userInfo.id,
    total: state.goods.total,
  }));

  const queryClient = useQueryClient();
  const selectedPlaylistId = playlist?.id;
  const goodsInPlaylist = useGetGoodsList([
    "goodsInPlaylistQuery",
    selectedPlaylistId,
  ]);
  const goodsQueryKey = ["goodsQuery", page];
  const goodList = useGetGoodsList(goodsQueryKey);

  const [form] = Form.useForm();
  const [checkedMap, setCheckedMap] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      setCheckedMap({});
      form.resetFields();
    }
    return () => {
      setPage(1);
    };
  }, [visible, form]);

  useEffect(() => {
    if (!isCreate) {
      if (goodsInPlaylist && visible) {
        setCheckedMap((checkedMap) => {
          const newCheckedMap = { ...checkedMap };
          goodsInPlaylist.forEach((goods) => {
            newCheckedMap[goods.id] = goods.id;
          });
          return newCheckedMap;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodsInPlaylist.length, visible, isCreate]);

  const onCheckedChange = ({ target: { value } }) => {
    const newChecedMap = { ...checkedMap };
    const key = String(value);
    if (key in checkedMap) {
      delete newChecedMap[key];
    } else {
      newChecedMap[key] = value;
    }
    setCheckedMap(newChecedMap);
  };

  const onCheckAllChange = useCallback(
    (e) => {
      setCheckedMap((checkedMap) => {
        const newCheckedMap = { ...checkedMap };
        goodList.forEach(({ id }) => {
          if (e.target.checked) {
            newCheckedMap[id] = id;
          } else {
            delete newCheckedMap[id];
          }
        });
        return newCheckedMap;
      });
    },
    [goodList]
  );

  const createPlaylistMutation = useMutation(
    async ({ name, checkedList, userId }) => {
      await api.goods.createPlayList(name, checkedList, userId);
    },
    {
      onSuccess: (data, { name, checkedList }) => {
        form.resetFields();
        if (typeof onClose === "function") {
          onClose();
        }
        queryClient.invalidateQueries("playlistQuery");
        message.success("创建成功");
      },
    }
  );

  const updatePlaylistMutation = useMutation(
    async ({ id, name, checkedList }) => {
      await api.goods.updatePlayList(id, name, checkedList);
    },
    {
      onSuccess: (data, { id, name, checkedList }) => {
        form.resetFields();
        if (typeof onClose === "function") {
          onClose();
        }
        queryClient.invalidateQueries("playlistQuery");
        queryClient.invalidateQueries([
          "goodsInPlaylistQuery",
          selectedPlaylistId,
        ]);
        message.success("修改成功");
      },
    }
  );

  const onFinish = useCallback(
    async (values) => {
      const { name } = values;
      if (isEmpty(checkedMap)) {
        return message.info("请选择商品");
      }

      const checkedList = Object.values(checkedMap);
      if (isCreate) {
        createPlaylistMutation.mutate({ name, checkedList, userId });
      } else {
        updatePlaylistMutation.mutate({
          id: selectedPlaylistId,
          name,
          checkedList,
        });
      }
    },
    [
      createPlaylistMutation,
      updatePlaylistMutation,
      checkedMap,
      userId,
      isCreate,
      selectedPlaylistId,
    ]
  );

  const onReset = useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
    }
    setCheckedMap({});
    form.resetFields();
  }, [form, onClose]);

  const checkboxItemRender = (item) => {
    if (item.status === "f") return null;
    const isChecked = String(item.id) in checkedMap;
    return (
      <li key={item.id}>
        <Checkbox
          value={item.id}
          checked={isChecked}
          onChange={onCheckedChange}
          className="yoyo-playlist-modal__stack-checkbox"
        >
          <GridItem
            className={classnames({
              selected: isChecked,
            })}
            imageUrl={item.image}
            name={item.name}
            price={item.price}
            isShowhoverButton={false}
          />
        </Checkbox>
      </li>
    );
  };

  const handleOnPaginationChange = (page) => {
    dispatch.goods.changePage({ page });
    setPage(page);
  };

  const goodsChecked = goodList.filter(({id}) => String(id) in checkedMap);
  const isCheckedAll =
    !!goodsChecked.length && goodsChecked.length === goodList.length;
  const isIndeterminate =
    !!goodsChecked.length && goodsChecked.length < goodList.length;

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title={isCreate ? "添加播放列表" : "编辑播放列表"}
      width="70vw"
      destroyOnClose
      maskClosable={false}
      className="addList_modal"
      bodyStyle={{
        overflow: "auto",
      }}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="商品列表名称"
          name="name"
          rules={[
            {
              required: true,
              message: "此项必填",
            },
          ]}
          initialValue={isCreate ? "" : playlist?.name}
        >
          <Input placeholder="请输入商品列表名称" />
        </Form.Item>
        <Form.Item label="选择商品">
          <Checkbox
            indeterminate={isIndeterminate}
            onChange={onCheckAllChange}
            checked={isCheckedAll}
          >
            全选
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <ul className="yoyo-autolive-page__grid">
            {goodList && goodList.map(checkboxItemRender)}
          </ul>
        </Form.Item>
        <Pagination
          className="flex justify-center"
          current={page}
          total={total}
          pageSize={PAGE_SIZE.NORMAL}
          onChange={handleOnPaginationChange}
        />
        <div className="flex mt-4 mx-auto w-full justify-center space-x-4">
          <Button htmlType="reset" onClick={onReset}>
            取消
          </Button>
          <Button htmlType="submit" type="primary" className="saveList_btn">
            保存
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default CreateOrEditPlaylistModal;
