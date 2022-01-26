import { useState, useMemo } from "react";
import { useInterval } from "react-use";
import { denormalize } from "normalizr";
import { goodsList as goodsListSchema } from "@/constants/schema";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";

export const useCountdown = (
  initValue = 0,
  { step, interval } = { step: 1, interval: 1000 }
) => {
  const [isCountingDowm, setIsCountingDowm] = useState(false);
  const [countValue, setCountValue] = useState(initValue);

  // 倒计时
  useInterval(
    () => {
      if (countValue > 0) {
        setCountValue(Math.max(0, countValue - step));
      } else {
        setIsCountingDowm(false);
        setCountValue(initValue);
      }
    },
    isCountingDowm ? interval : null
  );

  return {
    isCountingDowm,
    setIsCountingDowm,
    countValue,
    start: () => {
      setIsCountingDowm(true);
      setCountValue(initValue);
    },
  };
};

export const useGetGoodsList = (goodsQueryKey) => {
  const queryClient = useQueryClient();
  const entities = useSelector((state) => state.goods.entities);
  const goodsListIds = queryClient.getQueryData(goodsQueryKey);
  const goodsList = useMemo(() => {
    let result = [];
    if (goodsListIds) {
      result = denormalize(goodsListIds, goodsListSchema, entities);
    }
    return result;
  }, [goodsListIds, entities]);
  return goodsList;
};
