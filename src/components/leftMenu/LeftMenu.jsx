import React from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import menuList from "../../config/MenuConfig";
import "./style.less";

const LeftMenu = () => {
  const getMenuList = () => {
    return menuList.reduce((pre, item) => {
      if (!item.children) {
        pre.push(
          <Menu.Item
            key={item.key}
            icon={<img src={item.icon} alt="menu icon" />}
          >
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        );
      }
      return pre;
    }, []);
  };

  return (
    <div className="left-nav">
      <Menu
        selectedKeys={
          sessionStorage.getItem("activeKey")
            ? sessionStorage.getItem("activeKey")
            : "/autolive/playlist"
        }
        style={{
          background: "linear-gradient(0deg, #293144, #435680)",
          height: "100%",
        }}
        mode="inline"
        theme="dark"
        onSelect={({ key }) => {
          sessionStorage.setItem("activeKey", key);
        }}
      >
        {getMenuList()}
      </Menu>
    </div>
  );
};

export default withRouter(LeftMenu);
