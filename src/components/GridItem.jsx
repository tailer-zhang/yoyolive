import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Button, Badge, Tooltip, Popconfirm } from "antd";
import { ClockCircleFilled, QuestionCircleFilled, CheckCircleFilled } from '@ant-design/icons';

GridItem.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  status: PropTypes.string,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

function GridItem({
  className,
  name,
  price,
  imageUrl,
  onClick,
  onEdit,
  onDelete,
  status,
  isShowhoverButton = true,
}) {
  const statusFunc = (e) => {
    switch (e) {
      case "f":
        return <ClockCircleFilled style={{ color: '#f5222d' }} />;
      case "d":
        return <QuestionCircleFilled style={{ color: "yellow" }} />;
      case "u":
        return <CheckCircleFilled style={{ color: '#87d068' }} />;
      default:
        return <ClockCircleFilled style={{ color: '#f5222d' }} />;
    }
  }
  return (
    <div
      className={classnames(
        "yoyo-autolive-page__grid-item cursor-pointer",
        className
      )}
      style={{ position: "relative" }}
      onClick={onClick}
    >
      {
        status ? <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "flex-end", padding: 8 }}>
          <Tooltip placement="topLeft" arrowPointAtCenter color={
            status === 'f' ? "#f5222d" :
              status === 'd' ? "yellow" : "#87d068"
          } title={
            status === 'f' ? "商品介绍正在生成中" :
              status === 'd' ? "商品介绍待确认" : "商品介绍已确认"
          }>
            <Badge count={statusFunc(status)} style={{ zIndex: 10 }} title={"语音生成中"} />
          </Tooltip>
        </div> : ""
      }
      <div className="grid-item__image-container rounded-xl overflow-hidden group relative">
        <img
          src={imageUrl}
          className="grid-item__image w-full"
          alt=""
        />
        {isShowhoverButton && (
          <div className="grid-item__hover-btns absolute left-0 bottom-0 w-full flex justify-around opacity-0 group-hover:opacity-100">
            <Button type="text" onClick={onEdit}>
              编辑
            </Button>
            <Popconfirm
              title="是否确定删除?"
              onConfirm={onDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text">
                删除
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
      <div className="goods-item__name text-center mt-4 break-words">{name}</div>
      {typeof price === "number" || typeof price === "string" ? (
        <div className="goods-item__name text-center">￥{price}</div>
      ) : null}
    </div>
  );
}

export default GridItem;
