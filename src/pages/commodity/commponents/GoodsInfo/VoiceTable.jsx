import React from 'react';
import { Form, Table, Select } from "antd";
import { requireRule } from '@/utils/antdFormRules';


const VoiceTable = (props) => {
  const { dataSource } = props;
  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      render: (a, r, index) => `${index + 1}`,
    },
    {
      title: "介绍文案",
      dataIndex: "text",
    },
    {
      title: "动作标签",
      dataIndex: "tag",
      render: (text, record) => {
        return <Form.Item
          name={record.id}
          rules={requireRule}
          initialValue={text}
        >
          <Select options={[
            { label: "开场", value: "开场" },
            { label: "自然", value: "自然" },
            { label: "赞美", value: "赞美" },
          ]}>
          </Select>
        </Form.Item>
      }
    },
    {
      title: "生成语音",
      dataIndex: "voice",
      render: (text) => {
        return <audio src={text} controls="controls">
          您的浏览器不支持 audio 标签。
        </audio>
      },
    }
  ];

  return <Table columns={columns}
    bordered={true}
    loading={false}
    dataSource={dataSource}
    className="VoiceFormTable"
  />
};

export default VoiceTable;