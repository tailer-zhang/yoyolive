import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, PageHeader, Modal, Spin } from "antd";
import { useLocation, useParams, useHistory } from "react-router-dom";
import {
  requireRule,
  NumRule,
  NameRule,
  ChineseRule,
} from "@/utils/antdFormRules";
import UploadOss from "@/components/UploadOss";
import YoyoNumberInput from "@/components/YoyoNumberInput";
import HighlightTextArea from "./HighlightTextArea";
import VoiceTable from "./VoiceTable";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { api } from "@/api";
import "./style.less";

const { Item } = Form;
let tagFormList = {}; // 存储修改动作标签
const GoodsInfo = () => {
  const { goodsId: GoodsInfoId } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { state: locationState } = useLocation(); // 路由传来的参数
  const goodsInfo = locationState?.goodsInfo;
  const { userId } = useSelector((state) => ({
    userId: state.user.userInfo.id,
  }));
  const history = useHistory();

  const goBack = () => {
    if (form.isFieldsTouched()) {
      if (GoodsInfoId) {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const result =
              query.queryKey[0] === "goodsQuery" &&
              query.state?.data?.includes(Number(GoodsInfoId));
            return result;
          },
        });
      } else {
        queryClient.invalidateQueries({
          refetchActive: true,
          refetchInactive: true,
          predicate: (query) => {
            return query.queryKey[0] === "goodsQuery";
          },
        });
      }
    }
    history.goBack();
  };

  const [Disable, setDisable] = useState(false);
  // 初始化表单值
  const initFormValuse = {
    coverImage: goodsInfo?.image && [
      {
        uid: `${goodsInfo.id}`,
        status: "done",
        url: `${goodsInfo.image}`,
      },
    ],
    name: goodsInfo?.name,
    price: goodsInfo?.price,
    introduce: goodsInfo?.introduce,
  };
  // 根据id获取商品信息
  const GoodsInfo = useQuery(
    ["GoodsInfoById", GoodsInfoId],
    async () => {
      const data = await api.goods.getGoodsInfoById(GoodsInfoId);
      return data;
    },
    {
      enabled: !!GoodsInfoId,
    }
  );
  // 商品名字长度
  const [GoodNameLength, setGoodNameLength] = useState(
    goodsInfo?.name.length || 0
  );
  // 敏感词检测
  const testWordsMutation = useMutation(
    async (introduce) => api.goods.testGoodProhibitedWords(introduce),
    {
      onSuccess: (data) => {
        if (data.has_prohibited_words) {
          if (!GoodsInfoId) message.warning("商品介绍带有敏感词！");
          form.validateFields(["introduce"]); // 触发表单验证，提醒有违禁词
        }
      },
    }
  );
  // 修改的接口 编辑商品
  const UpdateGoodsMutation = useMutation(
    async ({
      image,
      name,
      price,
      introduce,
      tag_list,
      simple_sentence_id_list,
    }) => {
      return api.goods.updateGoods(GoodsInfoId, {
        image,
        name,
        price,
        introduce,
        tag_list,
        simple_sentence_id_list,
      });
    },
    {
      onSuccess: (data) => {
        message.success("修改成功");
        queryClient.refetchQueries(["goodsQuery", 1]);
        goBack();
      },
    }
  );
  const CreatVoiceMutation = useMutation(
    // 生成语音的状态
    async ({ image, name, price, introduce }) => {
      return api.goods.createVoice(userId?.toString(), {
        image,
        name,
        price,
        introduce,
        commodity_id: GoodsInfoId,
        is_modify: 1,
      });
    },
    {
      onSuccess: (data) => {
        setDisable(false);
        queryClient.setQueryData(["GoodsInfoById", GoodsInfoId], (tdata) => {
          return {
            ...tdata,
            ...data,
          };
        });
      },
    }
  );
  // 保存的接口 创建商品
  const CreatGoodsMutation = useMutation(
    async ({ image, name, price, introduce }) => {
      return api.goods.creatNewGoods(image, name, price, introduce);
    },
    {
      onSuccess: (data, variables) => {
        message.success("新增成功");
        goBack();
        const { image, name, price, introduce } = variables;
        api.goods.createVoice(userId?.toString(), {
          image,
          name,
          price,
          introduce,
          commodity_id: data.id.toString(),
        });
      },
    }
  );
  const formGet = (name) => form.getFieldValue(name);
  // 生成语音的点击事件
  const createVoice = () => {
    testWordsMutation.mutate(form.getFieldValue("introduce")); // 先检测文字是否包含敏感词
    if (GoodsInfoId) {
      // 如果是编辑商品则生成语音
      CreatVoiceMutation.mutate({
        image: formGet("coverImage")[0].url,
        name: formGet("name"),
        price: formGet("price"),
        introduce: formGet("introduce"),
      });
    }
  };
  // 表单提交事件
  const onFinish = async ({ coverImage, name, price, introduce }) => {
    const op = await testWordsMutation.mutateAsync(
      form.getFieldValue("introduce")
    ); // 先检测文字是否包含敏感词;
    if (op?.has_prohibited_words) {
      return;
    }
    if (GoodsInfoId) {
      // 修改
      UpdateGoodsMutation.mutate({
        name,
        price,
        introduce,
        image: coverImage[0].url,
        tag_list: Object.values(tagFormList),
        simple_sentence_id_list: Object.keys(tagFormList),
      });
    } else {
      // 创建
      CreatGoodsMutation.mutate({
        name,
        price,
        introduce,
        image: coverImage[0].url,
      });
    }
  };

  // 生成语音后的表格数据
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    const list = [];
    tagFormList = {};
    GoodsInfo.data?.action_tag_list?.forEach((value, index) => {
      list.push({
        key: `goodsTable${index}`,
        text: GoodsInfo.data?.word_list[index],
        tag: value,
        voice: GoodsInfo.data?.wav_url_list[index],
        id: GoodsInfo.data?.simple_sentence_id_list[index],
      });
      tagFormList[GoodsInfo.data?.simple_sentence_id_list[index]] = value;
    });
    setDataSource(list);
  }, [GoodsInfo.data]);
  return (
    <div className="bg-white h-full">
      <PageHeader onBack={goBack} title={GoodsInfoId ? "编辑商品" : "新增商品"}>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 12 }}
          initialValues={initFormValuse}
          onFinish={onFinish}
          onValuesChange={(changedFields) => {
            if (changedFields?.introduce) {
              if (GoodsInfo.data?.introduce === changedFields.introduce) {
                setDisable(false);
              } else {
                setDisable(true);
              }
            } else {
              for (let key in changedFields) {
                if (!isNaN(key)) tagFormList[key] = changedFields[key];
              }
            }
          }}
        >
          <Item
            label="商品封面"
            name="coverImage"
            getValueFromEvent={(fileList) => fileList}
            valuePropName="fileList"
            rules={requireRule}
          >
            <UploadOss size="1" type="goodsImg" />
          </Item>
          <Item label="商品名称" name="name" rules={NameRule}>
            <Input
              suffix={
                <span style={{ color: "#9ea7b4" }}>{GoodNameLength}/30</span>
              }
              onChange={(e) => setGoodNameLength(e.target.value.length)}
              placeholder="请输入商品名称"
              maxLength={30}
            />
          </Item>
          <Item label="商品价格" name="price" rules={NumRule}>
            <YoyoNumberInput />
          </Item>
          <Item
            label="商品介绍"
            name="introduce"
            extra="介绍文案以句号为段落结束"
            valuePropName="goodIntroduce"
            rules={[
              ...ChineseRule,
              () => ({
                validator(_, value) {
                  const highlight = testWordsMutation.data?.replace_str;
                  if (!highlight || !value || highlight.length === 0) {
                    return Promise.resolve();
                  }
                  for (let i = 0, len = highlight.length; i < len; ++i) {
                    if (value.includes(highlight[i]))
                      return Promise.reject(new Error("*商品介绍中有违禁词!"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <HighlightTextArea
              GoodsInfoId={GoodsInfoId}
              CisLoading={CreatVoiceMutation.isLoading}
              isLoading={testWordsMutation.isLoading}
              createVoice={createVoice}
              highlight={testWordsMutation.data?.replace_str}
            />
          </Item>
          {GoodsInfoId ? (
            <Spin
              style={{ padding: "0px 50px" }}
              spinning={GoodsInfo.isLoading}
              controlsList="nodownload"
            >
              <VoiceTable form={form} dataSource={dataSource} />
            </Spin>
          ) : (
            ""
          )}
          <div className="flex justify-center space-x-4 mt-4">
            <Button onClick={goBack}>取消</Button>
            {GoodsInfoId ? (
              <Button
                htmlType="submit"
                type="primary"
                loading={CreatGoodsMutation.isLoading}
                disabled={CreatVoiceMutation.isLoading || Disable}
              >
                {CreatVoiceMutation.isLoading
                  ? "生成语音中"
                  : Disable
                  ? "介绍修改请先生成语音"
                  : CreatGoodsMutation.isLoading
                  ? "保存中"
                  : "保存"}
              </Button>
            ) : (
              <Button
                htmlType="submit"
                type="primary"
                loading={CreatGoodsMutation.isLoading}
              >
                {CreatGoodsMutation.isLoading ? "保存中" : "保存"}
              </Button>
            )}
          </div>
        </Form>
        <Modal
          visible={CreatGoodsMutation.isLoading}
          closable={false}
          footer={false}
          maskClosable={false}
          width={160}
        >
          <Spin tip="商品信息保存中..." />
        </Modal>
      </PageHeader>
    </div>
  );
};

export default GoodsInfo;
