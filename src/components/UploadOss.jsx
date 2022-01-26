import React, { useState } from "react";
import { Upload, Modal, message, Button } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ImgCrop from 'antd-img-crop';

const UploadOss = (props) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setpreviewImage] = useState();
  const { onChange, fileList, type = "feedbackImg", size = "1" } = props;
  const BASE_URL = process.env.REACT_APP_API;
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片不能超过5mb!');
    }
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/gif" ||
      file.type === "image/webp";

    if (!isJpgOrPng) {
      message.error("只能上传JPG/PNG/GIF/WEBP的文件");
    }
    return isJpgOrPng && isLt5M;
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleChange = ({ fileList, file }) => {
    if (file.status === "error") {
      message.error("图片上传失败");
    }
    //小图的上传图的改变
    if (file.status === "done") {
      fileList = fileList.map((item) => {
        let fileObj = {
          path: (item.response && item.response.data) || item.path || item.url,
          url: (item.response && item.response.data) || item.path || item.url,
          uid: item.uid,
        };
        return fileObj;
      });
    }
    onChange(fileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setpreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const data = (file) => {
    const suffix = file.name.slice(file.name.lastIndexOf("."));
    return {
      suffix: suffix,
      preffix: type,
    };
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">上传头像</div>
    </div>
  );

  return (
    <div className="clearfix" style={{ display: "flex", alignItems: "flex-end" }}>
      <ImgCrop modalTitle="编辑图片" modalOk="确定" modalCancel="取消">
        <Upload
          data={data}
          listType="picture-card"
          fileList={fileList}
          accept=".jpg, .png, .gif, .webp"
          action={`${BASE_URL}/api/common/upload`}
          beforeUpload={beforeUpload}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
        >
          {fileList && fileList.length >= size ? null : uploadButton}
        </Upload>
      </ImgCrop>
      {fileList && fileList.length >= size ? <ImgCrop modalTitle="编辑图片" modalOk="确定" modalCancel="取消">
        <Upload
          data={data}
          fileList={fileList}
          action={`${BASE_URL}/api/common/upload`}
          beforeUpload={beforeUpload}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={false}
          maxCount={1}
          accept=".jpg, .png, .gif, .webp">
          <Button icon={<UploadOutlined />} style={{ position: "absolute", bottom: 8, left: 120 }}>上传头像</Button>
        </Upload>
      </ImgCrop>
        : null}
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img src={previewImage} alt="avatar" style={{ width: "100%" }} />
      </Modal>
    </div>
  );
};

export default UploadOss;
