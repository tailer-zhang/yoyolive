import React, { useState } from "react";
import { Button, Modal, Form, Input, Row, Col, message } from "antd";
import { api } from "@/api";
import FormModal from "@/components/formModal/FormModal";


const QuFeedback = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  	// 弹窗关闭事件 ↓
	const onCancel = () => {
		setVisible(false);
	}
  const onFinish = async (values) => {
    const { text, img } = { ...values };
    const userId = JSON.parse(localStorage.getItem("loginInfo")).id;
    setLoading(true);
    await api.help.handleFeedback(userId, text, img[0].url).then((res) => {
      message.success("反馈成功");
      setVisible(false);
      setLoading(false);
    });
  };
  const ProblemList = [{
    title: "问题反馈",
    FormProps: {
      layout: "vertical",
    },
    FormItemList: [
      {
        FormItemProps: {
          name: "text",
          key: "text",
          label: "问题说明：",
          rules: [{ required: true, message: "此项必填" }]
        },
        type: "TextArea",
        ItemChildProps: {
          placeholder: "请输入问题描述",
        }
      },
      {
        FormItemProps: {
          name: "img",
          key: "img",
          label: "上传图片附件：",
          valuePropName: "fileList",
          rules: [{ required: true, message: "此项必填" }]
        },
        type: "UploadOss",
        ItemChildProps: {
          size: "1",
          type: "feedbackImg"
        },
      }
    ]
  }]
  return (
    <>
      <Button onClick={() => setVisible(true)}>问题反馈</Button>
      <FormModal
        visible={visible} setVisible={setVisible}
        ModalList={ProblemList}
        onCancel={onCancel}
        onFinish={onFinish}
        confirmLoading={loading}
        form={form}
      />
    </>
  );
};

export default QuFeedback;
