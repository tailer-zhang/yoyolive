import React, { useState, useCallback } from "react";
import { Button, Form, Input, Row, Col, message } from "antd";
import UploadOss from "../../components/UploadOss";
import {
  UserOutlined,
  SmileOutlined,
  BankOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { UpdatePhoneModal, UpdatePWModal } from "./components/modals";
import { useDispatch, useSelector } from "react-redux";
import { geTel } from "@/utils/tools";
import { useMutation, useQuery } from "react-query";
import { api } from "@/api";
import "./style.less";

const rules = [
  {
    required: true,
    message: "此项必填",
  },
  {
    pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
    message: "只能包含文字数字下划线字符!",
  },
];

const User = () => {
  const normFile = (fileList) => fileList;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [PhoneVisible, setPhoneVisible] = useState(false); // 电话弹窗显隐状态
  const [PWVisible, setPWVisible] = useState(false); // 密码弹窗显隐状态
  const SaveUserInfoMutation = useMutation(
    async ({ avatar, nickname, name, org_name }) => {
      return api.user.updateUserInfo(
        avatar[0]?.url,
        nickname,
        name,
        org_name,
      );
    },
    {
      onSuccess: (data) => {
        message.success("保存成功！");
        dispatch.user.mapUserInfo(data);
      },
    }
  );
  const userInfo = useSelector((state) => state.user.userInfo);
  const userFields = useSelector((state) => state.user.userFields);
  useQuery(
    [],
    async () => {
      return await api.user.getUserInfo();
    },
    {
      onSuccess: (data) => {
        dispatch.user.mapUserInfo(data);
      },
    }
  );
  const onFinish = useCallback(
    async (values) => {
      SaveUserInfoMutation.mutate({ ...values });
    },
    [SaveUserInfoMutation]
  );

  const DivLabel = (img, text) => (
    <div className="divLabel">
      {img} <div>{text}</div>
    </div>
  );
  return (
    <div className="user-modal bg-white p-4 h-full">
      <Form
        layout="horizontal"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 8 }}
        onFinish={onFinish}
        form={form}
        className="user_form"
        // eslint-disable-next-line array-callback-return
        fields={userFields}
      >
        <Button type="text" className="basic-info">
          基本信息
        </Button>
        <Form.Item
          label="用户头像"
          name="avatar"
          getValueFromEvent={normFile}
          valuePropName="fileList"
        >
          <UploadOss size="1" type="userImg" />
        </Form.Item>
        <Form.Item
          label={DivLabel(<SmileOutlined />, "昵称")}
          name="nickname"
          rules={rules}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          label={DivLabel(<UserOutlined />, "姓名")}
          rules={rules}
          name="name"
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          label={DivLabel(<BankOutlined />, "单位名称")}
          rules={rules}
          name="org_name"
        >
          <Input placeholder="请输入单位名称" />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 8, offset: 3 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button htmlType="submit" type="primary" className="save-btn">
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Form
        layout="horizontal"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 8 }}
      >
        <Button type="text" className="basic-info">
          账号设置
        </Button>
        <Form.Item
          label={DivLabel(<PhoneOutlined />, "手机号码")}
          name="phone_num"
        >
          <Row justify="end" gutter={[10, 5]}>
            <Col flex="auto">
              <Input
                placeholder="请输入手机号码"
                readOnly
                className="accout-set"
                value={geTel(userInfo?.phone_num)}
              />
            </Col>
            <Col>
              <Button onClick={() => setPhoneVisible(true)}>修改</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label={DivLabel(<LockOutlined />, "密码")} name="password">
          <Row justify="end" gutter={[10, 5]}>
            <Col flex="auto">
              <Input
                placeholder="请输入密码"
                readOnly
                className="accout-set"
                value={"*************"}
              />
            </Col>
            <Col>
              <Button onClick={() => setPWVisible(true)}>修改</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <UpdatePhoneModal
        visible={PhoneVisible}
        setVisible={setPhoneVisible}
        phone_num={userInfo?.phone_num}
      />
      <UpdatePWModal
        visible={PWVisible}
        setVisible={setPWVisible}
        phone_num={userInfo?.phone_num}
      />
    </div>
  );
};

export default User;
