import React, { Suspense, lazy, useState, useEffect } from "react";
import { Layout } from "antd";
import { Switch, Route, Redirect, NavLink } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import classnames from "classnames";
import { LoadingOutlined } from "@ant-design/icons";
import LeftMenu from "../../components/leftMenu/LeftMenu";
import { useQuery } from "react-query";
import { api } from "@/api";
import { useSelector, useDispatch } from "react-redux";
import { normalize } from "normalizr";
import rolePreviewImageYoyo from "@/images/role-preview-yoyo.png";
import { goodsList, playlistList } from "@/constants/schema";
import "./style.less";

const defaultRoleList = [
  {
    name: "YOYO",
    id: 1,
    image: rolePreviewImageYoyo,
  },
];

const { Sider, Content, Header } = Layout;

const AutoLive = lazy(() => import("../autoLive/AutoLive"));
const Commodity = lazy(() => import("../commodity/Commodity"));
const GoodsInfo = lazy(() =>
  import("../commodity/commponents/GoodsInfo/index.jsx")
);
const User = lazy(() => import("../user/User"));
const System = lazy(() => import("../system/System"));
const Help = lazy(() => import("../help/Help"));

const LivePane = () => {
  const history = useHistory();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { playlistIdForQuery, goodsPage } = useSelector((state) => ({
    playlistIdForQuery: state.goods.playlistId,
    goodsPage: state.goods.page,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/login");
    }
  }, [history]);

  // 查询用户个人信息
  useQuery(["userInfoQuery"], async (key) => {
    const res = await api.user.getUserProfile();
    dispatch.user.mapUserInfo(res);
    return res;
  });

  // 查询商品列表
  useQuery(
    ["goodsQuery", goodsPage],
    async ({ queryKey: [key, page] }) => {
      const {
        content,
        pagination: { total },
      } = await api.goods.getGoodsList(page);
      const normalizedData = normalize(content, goodsList);
      dispatch.goods.setTotal({ total: total });
      dispatch.goods.addGoodsEntities({
        entities: normalizedData.entities,
      });
      return normalizedData.result;
    },
    {
      placeholderData: [],
    }
  );

  // 查询播放清单列表
  useQuery(
    "playlistQuery",
    async () => {
      const { content } = await api.playlist.getPlaylists();
      const normalizedData = normalize(content, playlistList);
      return normalizedData;
    },
    {}
  );

  // 查询某个播放列表中的所有商品
  useQuery(
    ["goodsInPlaylistQuery", playlistIdForQuery],
    async ({ queryKey: [key, playlistIdForQuery] }) => {
      const res = await api.goods.getGoodsByPlaylistId(playlistIdForQuery);
      const normalizedData = normalize(res, goodsList);
      dispatch.goods.addGoodsEntities({
        entities: normalizedData.entities,
      });
      return normalizedData.result;
    },
    { enabled: !!playlistIdForQuery }
  );

  // 查询内置角色列表
  useQuery(
    ["buildinRolesQuery"],
    async () => {
      return defaultRoleList;
    },
    {}
  );

  // 查询自定义背景列表
  useQuery(
    ["backdropsQuery"],
    async () => {
      const res = await api.background.getBackgrounds();
      return res.content;
    },
    {}
  );

  const toggle = () => setCollapsed(!collapsed);

  return (
    <div className="menupane">
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          breakpoint="xxl"
          onCollapse={toggle}
        >
          <LeftMenu />
        </Sider>
        <Layout>
          <Switch>
            <Route
              path="/autolive"
              render={() => {
                return (
                  <Header
                    className="site-layout-sub-header-background"
                    style={{ padding: 0, background: "#fff" }}
                  >
                    <nav className="yoyo-autolive-page__nav space-x-4 ml-8 h-16 flex items-center">
                      <li>
                        <NavLink exact to="/autolive/playlist">
                          商品列表
                        </NavLink>
                      </li>
                      <li>
                        <NavLink exact to="/autolive/role">
                          角色设置
                        </NavLink>
                      </li>
                      <li>
                        <NavLink exact to="/autolive/bglist">
                          背景设置
                        </NavLink>
                      </li>
                      <li>
                        <NavLink exact to="/autolive/interactiveSet">
                          直播设置
                        </NavLink>
                      </li>
                    </nav>
                  </Header>
                );
              }}
            />
          </Switch>
          <Content
            className={classnames("flex-1 p-3", {
              "overflow-hidden": location.pathname.split("/")[1] === "autolive",
            })}
          >
            <Suspense
              fallback={
                <div style={{ textAlign: "center" }}>
                  <LoadingOutlined />
                </div>
              }
            >
              <Switch>
                <Route path="/autolive" component={AutoLive} />
                <Route path="/goods" component={Commodity} />
                <Route path="/goodinfo/:goodsId?" component={GoodsInfo} />
                <Route path="/user" component={User} />
                <Route path="/system" component={System} />
                <Route path="/help" component={Help} />
                <Redirect to="/autolive/playlist" />
              </Switch>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default LivePane;
