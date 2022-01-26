import React, { useState } from "react";
import { Tabs } from "antd";
import { useQueryClient } from "react-query";
import GridItem from "@/components/GridItem";
import classnames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
const { TabPane } = Tabs;

const RolePane = () => {
  const queryClient = useQueryClient();
  const buildinRoles = queryClient.getQueryData(["buildinRolesQuery"]) || [];
  const customRoles = queryClient.getQueryData(["customRolesQuery"]) || [];

  const dispatch = useDispatch();

  const { selectedRoleIndex, activeRoleTabKey } = useSelector(
    (state) => state.autolive
  );

  const selectedRoleId = get(
    activeRoleTabKey === "buildinRole" ? buildinRoles : customRoles,
    `[${selectedRoleIndex}].id`
  );

  const handleSelectRole = (id, index) => {
    dispatch.autolive.selectRole({ index });
  };

  const listItemRender = (item, index) => {
    return (
      <li key={item.id}>
        <GridItem
          className={classnames({
            selected: item.id === selectedRoleId,
          })}
          name={item.name}
          imageUrl={item.image}
          onClick={() => handleSelectRole(item.id, index)}
          isShowhoverButton={false}
        />
      </li>
    );
  };

  const onTabChange = (activeKey) => {
    dispatch.autolive.changeActiveRoleTab(activeKey);
  };

  return (
    <div className="p-5">
      <ul className="yoyo-autolive-page__role-list yoyo-autolive-page__grid">
        {buildinRoles.map(listItemRender)}
      </ul>
      {/* <Tabs activeKey={activeRoleTabKey} onChange={onTabChange}>
        <TabPane tab="预设模型" key="buildinRole">
          <ul className="yoyo-autolive-page__role-list yoyo-autolive-page__grid">
            {buildinRoles && buildinRoles.map(listItemRender)}
          </ul>
        </TabPane>
        <TabPane tab="自定义角色" key="customRole">
          <ul className="yoyo-autolive-page__role-list yoyo-autolive-page__grid">
            {customRoles && customRoles.map(listItemRender)}
          </ul>
        </TabPane>
      </Tabs> */}
    </div>
  );
};

export default RolePane;
