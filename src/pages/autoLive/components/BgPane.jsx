import React from "react";
import classnames from "classnames";
import { Tabs } from "antd";
import { useQueryClient } from "react-query";
import GridItem from "@/components/GridItem";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";

const { TabPane } = Tabs;
const defaultBackdropUrl = 'https://bit-static-file-prd.oss-cn-shenzhen.aliyuncs.com/20210823172403.jpg';
const BgPane = () => {
  const queryClient = useQueryClient();
  const backdrops = queryClient.getQueryData(["backdropsQuery"]) || [];

  const dispatch = useDispatch();

  const selectedBackdropIndex = useSelector(
    (state) => state.autolive.selectedBackdropIndex
  );

  const selectedBackdropId = get(backdrops, `[${selectedBackdropIndex}].id`);

  const handleSelectBg = async (id, index) => {
    dispatch.autolive.selectBackdrop({ index });
  };

  const listItemRender = (item, index) => {
    return (
      <li key={item.id}>
        <GridItem
          className={classnames({
            selected: item.id === selectedBackdropId,
          })}
          name={item.name}
          imageUrl={item.image || defaultBackdropUrl}
          onClick={() => handleSelectBg(item.id, index)}
          isShowhoverButton={false}
        />
      </li>
    );
  };

  return (
    <div className="yoyo-autolive-page__backdrop-list-pane px-5 pb-2">
      <Tabs defaultActiveKey="1">
        <TabPane tab="背景图片" key="backdrop">
          <ul className="yoyo-autolive-page__backdrop-list yoyo-autolive-page__grid">
            {backdrops && backdrops.map(listItemRender)}
          </ul>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BgPane;
