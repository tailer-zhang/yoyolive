import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Pagination,
  Typography
} from "antd";

const { Text, Title, Paragraph } = Typography;
// 帮助搜索后得详细内容
const HelpContent = (props) => {
  const { SearchHelpQuery, SearchValue, pageSize, setPageSize, SearchContent, SearchPagination, Current, setCurrent } = props;
  const page = (num = 4) => {
    const List = [];
    // 将关键词高亮
    const HighLightText = (str) => {
      return str?.replace(new RegExp(SearchValue, 'g'),
        `<span style=" color:#ff4d4f;">${SearchValue}</span>`);
    };
    for (let i = 0; i < num && i < SearchContent.length; ++i) {
      List.push(
        <div key={`helpPage${i}`}>
          <Title level={4} >
            <div dangerouslySetInnerHTML={{ __html: HighLightText(SearchContent[i].title.substr(SearchContent[i].title.indexOf(".") + 1)) }} />
          </Title>
          <Paragraph key={`HelpParagraph${i}`}>
            <div dangerouslySetInnerHTML={{ __html: HighLightText(SearchContent[i].text || "暂无内容") }} />
          </Paragraph>
        </div>
      )
    }
    return List;
  };
  return <>
    {
      SearchPagination?.total === 1 ? ""
        : <Title level={5}>
          共找到 <Text type="danger">{SearchPagination?.total}</Text> 条关于 “<Text type="danger">{SearchValue}</Text>” 的相关问题
        </Title>
    }
    <br />
    {
      SearchPagination?.total === 0 ?
        <div>

        </div> :
        <div>
          <Typography>
            {page(pageSize)}
          </Typography>
          <div style={{ display: "flex", justifyContent: "flex-end", marginRight: 4 }}>
            {
              SearchPagination?.total === 1 ? ""
                : <Pagination current={Current}
                  pageSize={pageSize}
                  size="small"
                  showSizeChanger
                  onChange={(page, pageSize) => {
                    setCurrent(page)
                    setPageSize(pageSize)
                    SearchHelpQuery(undefined, pageSize, page)
                  }
                  }
                  pageSizeOptions={['4', '6', '8', '10', '20']}
                  total={SearchPagination?.total} />
            }
          </div>
        </div>
    }
  </>
};

export default HelpContent;