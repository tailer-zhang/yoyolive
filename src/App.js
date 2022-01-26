//应用根组件
import React, { Component, lazy, Suspense } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import zh_CN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false
    }
  }
});

const Login = lazy(() => import("../src/pages/login/Login"));
const LivePane = lazy(() => import("../src/pages/livePane/LivePane"));

class App extends Component {
  render() {
    return (
      <ConfigProvider locale={zh_CN}>
        <Suspense
          fallback={
            <div style={{ textAlign: "center" }}>
              <LoadingOutlined />
            </div>
          }
        >
          <QueryClientProvider client={queryClient}>
            <HashRouter>
              <Switch>
                <Route path={["/login", "/forget-password", '/reset-password']} exact component={Login} />
                <Route path="/" component={LivePane} />
              </Switch>
            </HashRouter>
          </QueryClientProvider>
        </Suspense>
      </ConfigProvider>
    );
  }
}

export default App;
