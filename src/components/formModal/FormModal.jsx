import React from "react";
import { Button, Modal, Form, Input, Space } from "antd";
import UploadOss from "@/components/UploadOss";

// 公用表单弹窗组件
const FormModal = (props) => {
  const {
    visible,
    setVisible, // 控制是否显示
    ModalList = [], // 表单内容
    ModalNum = 0, // 需要渲染的表单内容数组的号码
    onFinish = () => {}, // 表单提交函数
    onCancel = () => {
      setVisible(false);
    }, // 弹窗关闭函数
    form,
    loading = false,
  } = props;

  const Item = (type = "", props) => {
    switch (type) {
      case "TextArea":
        return <Input.TextArea rows={5} maxLength={150} {...props} />;
      case "Password":
        return (
          <Input.Password className="InputLine" bordered={false} {...props} />
        );
      case "UploadOss":
        return <UploadOss {...props} />;
      default:
        return <Input className="InputLine" bordered={false} {...props} />;
    }
  };
  const normFile = (fileList) => fileList;
  return (
    <Modal
      title={ModalList[ModalNum]?.title}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      // getContainer={false}
      destroyOnClose
      maskClosable={false}
    >
      <Form onFinish={onFinish} form={form} {...ModalList[ModalNum]?.FormProps}>
        {ModalList[ModalNum]?.FormItemList.map((value) => (
          <Form.Item {...value.FormItemProps}
            getValueFromEvent={value.type === "UploadOss" ? normFile : ''}
          >
            {Item(value.type, value.ItemChildProps)}
          </Form.Item>
        ))}
        <div className="flex justify-center space-x-4">
          {ModalList.length - 1 === ModalNum ? (
            <>
              <Button onClick={onCancel}>取消</Button>
              <Button loading={loading} type="primary" htmlType="submit">
                确定
              </Button>
            </>
          ) : (
            <Button loading={loading} type="primary" htmlType="submit">
              下一步
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default FormModal;
