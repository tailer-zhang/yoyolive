import React, { useState, useEffect } from "react";
import { Button, Form, Select, Row, Col, Timeline, Space, Progress, message } from "antd";
import { RESOLUTION_LEVEL } from "@/constants";
import "./style.less";
import { useQuery, useQueryClient } from "react-query";
import { api } from "@/api";
import { ExportOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { getElectronModule } from "@/utils/tools";
import update from "@/utils/update";
import YoyoModal from "@/components/YoyoModal";
import UpdateForm from "./UpdateForm";

// 本地视频处理服务器的 url,
const appVersion = process.env.REACT_APP_VERSION;
const NODE_ENV = process.env.NODE_ENV;
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

const System = () => {
  const queryClient = useQueryClient();
  const updateInfo = queryClient.getQueryData("updateInfo");
  const dispatch = useDispatch();
  const resolution = useSelector((state) => state.autolive.resolution);
  const handleOnSelectChange = (value) => {
    dispatch.autolive.changeResolution({ resolution: value });
  };
  const [downloadStatus, setDownloadStatus] = useState();
  const [downloadMsg, setDownloadMsg] = useState();
  // 查询用户个人信息
  useQuery(["updateInfo"], async () => {
    const res = await api.help.getUpdate();
    return res;
  });

  const opts = [
    {
      label: "低",
      value: RESOLUTION_LEVEL.LOW,
    },
    {
      label: "中",
      value: RESOLUTION_LEVEL.MEDIUM,
    },
    {
      label: "高",
      value: RESOLUTION_LEVEL.HIGH,
    },
  ];
  // const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const updateClick = () => {
    const flag = update(appVersion, updateInfo);
    if (updateInfo.serverUpdate) {
      window.ipcRenderer.send("SHUTDOWN_VIDEO_PROCESS", true);
    }
    if (flag <= 0) {
      message.success("无新版本");
    }
    else if (flag === 1) { // 全量更新
      message.loading("开始全量更新");
      window.ipcRenderer.invoke('win-update', updateInfo);
    } else if (flag === 2) { // 增量更新
      message.loading("开始热更新");
      window.ipcRenderer.invoke('win-increment', updateInfo);
    }
  }

  useEffect(() => {
    window.ipcRenderer.on('downloadMsg', (_, data) => {
      setDownloadMsg(data.result);
      setDownloadStatus(data.status);
    })
    window.ipcRenderer.on('renderer-updateMsg', (_, data) => {
      switch (data.type) {
        case -1:
          message.error(data.data)
          setDownloadStatus('error');
          break
        case 0:
          message.info('正在检查更新');
          break
        case 1:
          message.destroy()
          message.success('已检查到新版本，开始下载');
          setDownloadStatus('progressing');
          break
        case 2:
          message.destroy()
          message.success('无新版本');
          break
        case 3:
          setDownloadMsg(data.percent.toFixed(2));
          break
        case 4:
          setDownloadStatus('success');
          message.loading('重启更新中...', 1)
          break
        case 5:
          message.destroy()
          message.warning(`未知错误 -- ${data.data}`)
          setDownloadStatus('error');
          break
        default:
          break
      }
    })
  }, [])
  return (
    <div className="system-modal bg-white p-4 h-full">
      <Form layout="horizontal" labelCol={{ span: 3 }} wrapperCol={{ span: 5 }}>
        <Form.Item label="动画质量" name="action" initialValue={resolution}>
          <Select
            bordered={false}
            onChange={handleOnSelectChange}
            options={opts}
            value={resolution}
          />
        </Form.Item>
        <Form.Item label="版本信息">
          <Row>
            <Col flex={2}>
              <Button type="text" onClick={() => {
                setVisible1(true)
                queryClient.invalidateQueries("updateInfo");
              }}
              >V{appVersion}</Button>
            </Col>
            {/* <Col flex={3}>
              <Button className="check_btn" onClick={() => setVisible(true)}>检查更新</Button>
            </Col> */}
          </Row>
        </Form.Item>
        <Form.Item label="用户操作"  >
          <Button icon={<ExportOutlined />} onClick={() => {
            dispatch.user.userLoginout();
            window.location.reload();
          }}>退出登录</Button>
        </Form.Item>
      </Form>
      <YoyoModal visible={visible1} setVisible={setVisible1} title="版本信息" >
        <Timeline>
          <Timeline.Item>
            <p>0.1.5 版本 2021/8/25 11:02:44</p>
            <p>1.图标替换，增加红色底色</p>
            <p>2.动画程序升级</p>
            <p>3.敏感词检测修复敏感词提示对不上的bug</p>
          </Timeline.Item>
        </Timeline>
        {downloadStatus ? <><Progress percent={downloadMsg} status={
          downloadStatus === 'progressing' ? 'active' :
            downloadStatus === 'error' ? 'exception' : 'success'
        } /> <div style={{ display: "flex", justifyContent: 'center' }}>
            {downloadStatus === 'progressing' ? '下载中，请勿关闭' :
              downloadStatus === 'error' ? '下载失败，请检查网络，尝试重新打开应用' : '下载成功，正在解压，请勿关闭'
            }
          </div> </> : ''}
        <Space size="large" style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
          <Button onClick={() => setVisible1(false)}>跳过更新</Button>
          <Button onClick={() => {updateClick()}} type="primary"
            loading={downloadStatus && downloadStatus !== 'error'}
          >
            立即更新
          </Button>
        </Space>
      </YoyoModal>
      {
        NODE_ENV === "development" ? <UpdateForm/> : ""
      }
    </div>
  );
};

export default System;
