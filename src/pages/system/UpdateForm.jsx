import React from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UpdateForm = () => {
  const BASE_URL = process.env.REACT_APP_API;

  const data = (file) => {
    const suffix = file.name.slice(file.name.lastIndexOf("."));
    return {
      suffix: suffix,
      preffix: "update",
    };
  };

  return (
    <div className="clearfix" style={{ display: "flex", alignItems: "flex-end" }}>
      <Upload
        data={data}
        // name="file"
        accept=".zip, .exe, .yml"
        action={`${BASE_URL}/api/common/upload`}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>上传文件</Button>
      </Upload>
    </div>
  );
};

export default UpdateForm;
