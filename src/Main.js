import React, { useState, useEffect } from "react";
import TitleBar from "frameless-titlebar";
import { Menu, Dropdown, Avatar, message } from "antd";
import { connect, useSelector } from "react-redux";
import App from "./App";
import logo from "../src/images/logo.png";
import { getElectronModule } from "@/utils/tools";
import "./main.less";

message.config({
  top: 75,
});

const getCurrentWindow = () => {
  if (window.isElectron) {
    const remote = getElectronModule("remote");
    if (remote) {
      return remote.getCurrentWindow();
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const currentWindow = getCurrentWindow();

const Main = ({ userLoginout, token }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    return () => {
      let { localServerWsClient } = window;
      if (localServerWsClient) {
        localServerWsClient.send("stop->{}");
        localServerWsClient.close();
        localServerWsClient = null;
      }
    };
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="exitLogin">
        <div style={{ textAlign: "center" }}>
          <div>
            <img
              src={userInfo?.avatar}
              style={{ width: "5vw", height: "8vh" }}
              alt=""
            />
          </div>
          <div style={{ margin: "0.5vw 0" }}>{userInfo?.name}</div>
          <div
            style={{
              color: "#FF8462",
            }}
            onClick={() => {
              userLoginout();
              window.location.reload();
            }}
          >
            退出登录
          </div>
        </div>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (isMaximized) {
      currentWindow?.maximize();
    } else {
      currentWindow?.unmaximize();
    }
  }, [isMaximized]);

  const handleMaximize = () => {
    setIsMaximized((isMaximized) => !isMaximized);
  };

  return (
    <div className="yoyo-app">
      <TitleBar
        className="yoyo-app__title-bar h-12"
        icon={<img src={logo} alt="" />}
        style={{
          height: "50px",
        }}
        currentWindow={currentWindow} // electron window instance
        platform={process.platform} // win32, darwin, linux
        onClose={() => currentWindow?.close()}
        onMinimize={() => currentWindow?.minimize()}
        onMaximize={handleMaximize}
        onDoubleClick={handleMaximize}
        maximized={isMaximized}
      >
        {token ? (
          <Dropdown overlay={menu}>
            <Avatar
              style={{ backgroundColor: "#fde3cf", width: "fitContent" }}
              src={userInfo.avatar}
            />
          </Dropdown>
        ) : null}
      </TitleBar>
      <App />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.user.token,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    userLoginout: dispatch.user.userLoginout,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
