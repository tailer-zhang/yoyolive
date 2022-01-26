import React from "react";
import { Tabs } from "antd";
import "./style.less";
import login_left from "./images/login_left.png";
import PhoneLogin from "./components/PhoneLogin";
import LoginByPwd from "./components/LoginByPwd";
import ForgetPwd from "./components/ForgetPwd";
import ResetPwd from "./components/ResetPwd";
import { Switch, Route } from "react-router-dom";

const { TabPane } = Tabs;

const Login = () => {
  return (
    <div className="login_modal h-full flex justify-center">
      <div className="login_form_modal">
        <Switch>
          <Route
            path="/login"
            render={() => {
              return (
                <div className="yoyo-login-pane flex my-20">
                  <div className="flex-1 justify-center items-center hidden lg:flex border-r">
                    <img
                      className="yoyo-login-page__image"
                      src={login_left}
                      alt=""
                    />
                  </div>
                  <div className="logi_right_form flex-1 flex justify-center">
                    <Tabs centered defaultActiveKey="phone" >
                      {/* <TabPane tab="手机登录" key="phone">
                        <PhoneLogin />
                      </TabPane> */}
                      <TabPane tab="密码登录" key="pwd">
                        <LoginByPwd />
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              );
            }}
          />
          <Route path="/forget-password" component={ForgetPwd} />
          <Route path="/reset-password" component={ResetPwd} />
        </Switch>
      </div>
    </div>
  );
};

export default Login;
