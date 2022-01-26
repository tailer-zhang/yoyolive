import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const ShopList = lazy(() => import("./ShopList"));
const RoleModal = lazy(() => import("./RoleModal"));
const BgPane = lazy(() => import("./BgPane"));
const InteractiveSet = lazy(() => import("./InteractiveSet"));

const LiveRoute = () => {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center" }}>
          <LoadingOutlined />
        </div>
      }
    >
      <Switch>
        <Route path="/autolive/role" component={RoleModal} />
        <Route path="/autolive/bglist" component={BgPane} />
        <Route path="/autolive/interactiveSet" component={InteractiveSet} />
        <Route path={['/autolive/playlist', '/autolive']} component={ShopList} />
      </Switch>
    </Suspense>
  );
};

export default LiveRoute;
