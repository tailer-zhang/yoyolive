import React from "react";
import { Button, Form, Input, PageHeader } from "antd";
import { useHistory } from "react-router-dom";
import { api } from "../../../api";

const EnterPwd = () => {
  const history = useHistory();
  const onFinish = async (values) => {
    const phone_num = sessionStorage.getItem("phone_num");
    const { password } = { ...values };
    await api.user.resetPwd(phone_num, password).then((res) => {
      if ("token" in res) {
        history.replace("./");
        localStorage.setItem("token", res.token);
        localStorage.setItem("loginInfo", JSON.stringify(res));
      }
    });
  };

  return (
    <div className="yoyo-reset-password-pane">
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title="返回"
      />
      <Form
        colon={false}
        requiredMark={false}
        name="reset-pasword-form"
        className="yoyo-form--sm"
        onFinish={onFinish}
      >
        <div className="yoyo-form-title">重置密码</div>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "此项必填",
            },
          ]}
          hasFeedback
          className="flex-item"
        >
          <Input.Password placeholder="设置6位以上数字、字母组合的密码" bordered={false}/>
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          className="flex-item"
          style={{ marginTop: "3vw" }}
          rules={[
            {
              required: true,
              message: "请输入你的密码",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("输入密码不匹配"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="再次输入密码" bordered={false} />
        </Form.Item>
        <Form.Item className="flex-item">
          <Button block htmlType="submit" className="reset-btn">
            进入哟哟自动播
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EnterPwd;
