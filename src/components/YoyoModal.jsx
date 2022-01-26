import React from "react";
import { Modal } from "antd";

// 公用表单弹窗组件
const YoyoModal = (props) => {
  const {
    visible,
    setVisible, // 控制是否显示
    title, // 标题
    onCancel = () => {
      setVisible(false);
    }, // 弹窗关闭函数
  } = props;
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      // getContainer={false}
      destroyOnClose
      maskClosable={false}
    >
      {props.children}
    </Modal>
  );
};

export default YoyoModal;
