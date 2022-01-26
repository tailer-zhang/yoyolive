import React, { useCallback, useEffect } from "react";
import { Form, Input, Checkbox, Button, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { api } from '@/api';
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";

import pwd_head from "../images/pwd_head.png";
import pwd_eye from "../images/pwd_eye.png";

const LoginByPwd = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const loginByPwdMutation = useMutation(
    async ({ phone_num, password }) => {
      return api.user.loginByPwd(phone_num, password);
    },
    {
      onSuccess: (data, { phone_num, password, remember }) => {
        if (remember) {
          localStorage.setItem("phone_num", phone_num);
          localStorage.setItem("password", password);
        }
        dispatch.user.userLogin(data);
        message.destroy();
        message.success("登录成功");
        history.replace("/");
      },
      onError: (error) => {
        message.destroy();
        message.error("登陆失败" + error);
      }
    }
  );
  useEffect(() => {
    if (loginByPwdMutation.isLoading) {
      message.destroy();
      message.loading("登陆中···")
    }
  }, [loginByPwdMutation.isLoading])
  const onFininsh = useCallback(
    async (values) => {
      const { phone_num, password, remember } = { ...values };
      loginByPwdMutation.mutate({ phone_num, password, remember });
    },
    [loginByPwdMutation]
  );

  return (
    <div>
      <Form
        form={form}
        colon={false}
        requiredMark={false}
        initialValues={{
          remember: true,
        }}
        className="yoyo-form--sm"
        onFinish={onFininsh}
      >
        <Form.Item
          name="phone_num"
          label={<img src={pwd_head} alt="" />}
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
          initialValue={localStorage.getItem("phone_num") || ""}
        >
          <Input placeholder="请输入手机号码" bordered={false} />
        </Form.Item>
        <Form.Item
          name="password"
          label={<img src={pwd_eye} alt="" />}
          rules={[
            {
              required: true,
              message: "此项必填",
            },
          ]}
          initialValue={localStorage.getItem("pwd") || ""}
        >
          <Input.Password placeholder="请输入密码" className="input_pwd" bordered={false}/>
        </Form.Item>
        <Form.Item className="remeber_flex">
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
          <Form.Item>
            <Link to="/forget-password">忘记密码？</Link>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" className="login-form-button" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginByPwd;
