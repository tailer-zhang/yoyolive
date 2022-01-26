import React from "react";
import { Input } from "antd";

const YoyoNumberInput = ({ onChange, value }) => {
  return <Input onChange={e => {
    const str = e.target.value.toString().match(/^\d+(?:\.\d{0,2})?/)?.[0];
    if (str) {
      onChange(str);
    }
    else onChange("");
  }
  }
    value={value}
    placeholder="请输入商品价格" maxLength={20} suffix={<span style={{ color: "#9ea7b4" }}>元</span>} />
};

export default YoyoNumberInput;