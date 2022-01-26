import React, { useState, useMemo, useEffect } from "react";
import {
  Input,
  Button,
  Divider,
  Badge,
  Menu,
  Dropdown,
  Space,
  AutoComplete,
} from "antd";
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from "react-redux";
import QuFeedback from "./components/QuFeedback";
import HelpContent from "./components/HelpContent";
import { RedoOutlined } from '@ant-design/icons';
import { api } from "@/api";
import "./style.less";
import customerService from "./images/customerService.jpg";

const { Search } = Input;

const Help = () => {
  const HelpFiles = useSelector(state => state.help.files);

  const dispatch = useDispatch();
  const menu = (
    <Menu>
      <Menu.Item key="qcode">
        <div style={{ textAlign: "center" }}>
          <img src={customerService} alt="logo" width="120" height="120"/>
          <div>微信扫码</div>
          <div>联系客服</div>
        </div>
      </Menu.Item>
    </Menu>
  );
  const HelpMenuQuery = useQuery([],
    async () => {
      return await api.help.getHelpMenu();
    },
    {
      onSuccess: (data) => {
        dispatch.help.getHelpMenu(data);
      },
      // enabled: false
    }
  );
  const [SearchValue, setSearchValue] = useState();
  const [SearchContent, setSearchContent] = useState();
  const [SearchPagination, setSearchPagination] = useState();
  const [pageSize, setPageSize] = useState(4);
  const [Current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const HelpTips = useMemo(() => {
    const list = [];
    Object.keys(HelpFiles).forEach((key, index) => {
      HelpFiles[key].forEach((value, tindex) => {
        let text = value.substring(value.indexOf(".") + 1);
        list.push(<div style={{ marginTop: 12 }} key={"HelpSearchValue" + index + tindex}>
          <Badge status="warning" text={text} onClick={() => {
            setSearchValue(text);
            SearchHelpQuery(text);
          }}
          />
        </div>);
      })
    })
    return list;
  }, [HelpFiles])
  const SearchHelpQuery = async (value = SearchValue, size = pageSize, page = Current) => {
    try {
      setLoading(true);
      const data = await api.help.searchHelp(value, size, page);
      data?.content && setSearchContent(data?.content);
      data?.pagination && setSearchPagination(data?.pagination);
      setLoading(false);
    } catch (log) {
      setLoading(false);
    }
  };
  const onSearch = (value) => {
    if (!value) {
      setSearchContent(undefined);
      setSearchPagination(undefined);
      setSearchValue(undefined);
      return;
    }
    setCurrent(1);
    setPageSize(4);
    SearchHelpQuery(value, 4, 1);
    setSearchValue(value);
  };
  // useEffect(() => {
  //   if (!HelpFiles) HelpMenuQuery.refetch();
  // }, [HelpFiles, HelpMenuQuery]);

  return (
    <div className="help-modal bg-whie p-4 h-full">
      <div className="help-header">
        <Space>
          <Search
            placeholder="请输入关键词"
            bordered={false}
            style={{ width: 250 }}
            onSearch={value => { onSearch(value) }}
            onChange={value => setSearchValue(value.target.value)}
            value={SearchValue}
            loading={loading}
            maxLength={30}
            allowClear
          />
        </Space>

        <Space>
          {/* <QuFeedback /> */}
          <Dropdown overlay={menu} arrow placement="bottomRight">
            <Button>联系我们</Button>
          </Dropdown>
        </Space>
      </div>
      <Divider />
      <div style={{ paddingLeft: 52, paddingRight: 40 }}>
        {
          SearchContent ?
            <>
              <HelpContent SearchHelpQuery={SearchHelpQuery} setPageSize={setPageSize} pageSize={pageSize} SearchValue={SearchValue} setCurrent={setCurrent} SearchContent={SearchContent} SearchPagination={SearchPagination} Current={Current} />
            </>
            :
            <>
              <h4>常见问题</h4>
              <div>
                {
                  HelpTips
                }
              </div>
            </>
        }
      </div>
    </div>
  );
};

export default Help;
