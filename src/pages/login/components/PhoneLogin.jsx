import React, { useCallback } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import login_phone from "../images/login_phone.png";
import login_lock from "../images/login_lock.png";
import { useMutation } from "react-query";
import { api } from "@/api";
import { useCountdown } from "@/utils/hooks";
import { useDispatch } from "react-redux";

const PhoneLogin = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const {
    isCountingDowm,
    countValue,
    start: startCountdown,
  } = useCountdown(59);

  const loginByCodeMutation = useMutation(
    async ({ phone_num, code }) => {
      return api.user.loginByCode(phone_num, code);
    },
    {
      onSuccess: (data) => {
        dispatch.user.userLogin(data);
        message.destroy();
        message.success("登录成功");
        history.replace("/");
      },
    }
  );

  const sendSMSMutation = useMutation(
    async (phone_num) => {
      return api.user.sendSMS(phone_num, "login");
    },
    {
      onSuccess: (data, phone_num) => startCountdown(),
    }
  );

  const onFinish = useCallback(
    async (values) => {
      const { phone_num, code } = { ...values };
      loginByCodeMutation.mutate({ phone_num, code });
    },
    [loginByCodeMutation]
  );

  const handleOnGetVerificationCodeBtnClick = useCallback(() => {
    const phone_num = form.getFieldValue("phone_num");
    sendSMSMutation.mutate(phone_num);
  }, [form, sendSMSMutation]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      colon={false}
      className="yoyo-form--sm"
      requiredMark={false}
    >
      <Form.Item
        name="phone_num"
        label={<img src={login_phone} alt="" />}
        rules={[
          {
            required: true,
            message: "此项必填",
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "请输入正确的手机号",
          },
        ]}
      >
        <Input
          placeholder="请输入手机号码"
          suffix={
            <Button onClick={handleOnGetVerificationCodeBtnClick}>
              {isCountingDowm ? countValue : "获取验证码"}
            </Button>
          }
          bordered={false}
        />
      </Form.Item>
      <Form.Item
        name="code"
        rules={[
          {
            required: true,
            message: "此项必填",
          },
        ]}
        label={<img src={login_lock} alt="" />}
      >
        <Input placeholder="请输入验证码" bordered={false}/>
      </Form.Item>
      <div className="text-center text-xs mt-9 mb-7 text-gray-400">
        *未注册手机将默认注册新账户
      </div>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          block
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PhoneLogin;