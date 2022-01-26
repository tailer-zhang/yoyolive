import React, { useMemo, useState } from 'react';
import { Button, Input } from "antd";
import { SoundOutlined, CheckOutlined } from "@ant-design/icons";
import './style.less';

// 敏感词高亮显示
const HighlightTextArea = (props) => {
  const { CisLoading, GoodsInfoId, isLoading, onChange, goodIntroduce, highlight = [], createVoice } = props;
  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const [Flag, setFlag] = useState(false);
  const divInnerHtml = useMemo(() => {
    let str = goodIntroduce;
    let newSet = new Set(highlight);
    newSet.forEach((e) => {
      let protectXss = e.toString();
      str = str.replace(
        new RegExp(protectXss, "g"),
        `<span style="background: #ffc0c0; border-radius: 3px;">${protectXss}</span>`
      );
    });
    return str;
  }, [goodIntroduce, highlight]);
  return <>
    <Input.TextArea
      onChange={e => {
        onChange(e.target.value.replace(/[\r\n]/g, ""));
        if (Flag) setFlag(false);
      }}
      className="inaa"
      value={goodIntroduce}
      placeholder="请输入商品介绍文案"
      maxLength={500}
      rows={8}
      ref={ref1}
      onScroll={() => {
        ref2.current.scrollTop = ref1.current.resizableTextArea.textArea.scrollTop;
      }}
    />
    <div ref={ref2} style={{ padding: "3px 11px" }} className="out" dangerouslySetInnerHTML={{ __html: divInnerHtml }}></div>
    <div style={{ position: "absolute", bottom: 0, right: -124 }}>
      <Button loading={isLoading || CisLoading} onClick={() => {createVoice(); setFlag(true); }}
        icon={Flag && highlight.length === 0 ? <CheckOutlined style={{ color: "#52c41a" }}/> : <SoundOutlined />}
      >
        {
          GoodsInfoId ?
            CisLoading ? "生成语音中" : "生成语音"
            :
            isLoading ? '检测中..' : '敏感词检测'
        }

      </Button>
    </div>
  </>
}

export default HighlightTextArea;