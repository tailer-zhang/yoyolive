import React, { useCallback } from "react";
import { Button, Form, Input, Row } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useCountdown } from "@/utils/hooks";
import { useMutation } from 'react-query';

import login_phone from "../images/login_phone.png";
import login_lock from "../images/login_lock.png";

const ForgetPwd = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const {
    isCountingDowm,
    countValue,
    start: startCountdown,
  } = useCountdown(59);

  
  const resetPwdByCodeMutation = useMutation(
    async ({ phone_num, newPassword }) => {
      return api.user.resetPwd(phone_num, newPassword);
    },
    {
      onSuccess: (data) => {
        dispatch.user.userLogin(data);
        message.success("密码重置成功");
      },
    }
  );

  const onFinish = async (values) => {
    history.push("/reset-password");
  };

  const sendSMSMutation = useMutation(
    async (phone_num) => {
      return api.user.sendSMS(phone_num, "reset_pwd");
    },
    {
      onSuccess: (data, phone_num) => startCountdown(),
    }
  );

  const handleOnGetVerificationCodeBtnClick = useCallback(() => {
    const phone_num = form.getFieldValue("phone_num");
    sendSMSMutation.mutate(phone_num);
  }, [form, sendSMSMutation]);

  return (
    <div className="yoyo-forgot-password-pane">
      <Form
        form={form}
        requiredMark={false}
        name="forgot-pasword-form"
        className="yoyo-form--sm"
        colon={false}
        onFinish={onFinish}
      >
        <div className="yoyo-form-title">忘记密码</div>
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
          label={<img src={login_lock} alt="" />}
          rules={[
            {
              required: true,
              message: "此项必填",
            },
          ]}
        >
          <Input placeholder="请输入验证码" bordered={false}/>
        </Form.Item>
        <Button type="primary" block htmlType="submit">
          下一步
        </Button>
        <Link to="/login" className="block text-center mt-7 text-xs">
          账号密码登陆
        </Link>
      </Form>
    </div>
  );
};

export default ForgetPwd;
