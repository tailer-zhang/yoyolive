import React, { useState, useCallback, useEffect } from "react";
import { Button, message, Form } from "antd";
import { api } from "@/api";
import { useMutation } from "react-query";
import { geTel } from "@/utils/tools";
import { useCountdown } from "@/utils/hooks";
import { useDispatch } from "react-redux";
import FormModal from "@/components/formModal/FormModal";

const UpdatePhoneModal = ({ visible, setVisible, phone_num }) => {
  const [ModalNum, setModalNum] = useState(0); // 如果有下一步，通过数字操控顺序
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    isCountingDowm,
    countValue,
    setIsCountingDowm,
    start: startCountdown,
  } = useCountdown(59);
  // 弹窗关闭事件 ↓
  const onCancel = () => {
    setVisible(false);
    form.resetFields();
    setModalNum(0);
  };
  const sendSMSMutation = useMutation(
    async (phone_num) => {
      return api.user.sendSMS(phone_num, "login");
    },
    {
      onSuccess: (data, phone_num) => startCountdown(),
    }
  );
  // 更新手机号
  const UpdateByPhoneMutation = useMutation(
    async ({ phone_num_new, code_new }) => {
      return api.user.resetphone_num(phone_num, phone_num_new, code_new);
    },
    {
      onSuccess: (data) => {
        message.success("修改成功");
        dispatch.user.mapUserInfo(data);
        setIsCountingDowm(false);
        onCancel();
      },
    }
  );
  // 验证手机号
  const CheckByPhoneMutation = useMutation(
    async ({ code }) => {
      return api.user.checkphone_num(phone_num, code);
    },
    {
      onSuccess: () => {
        message.success("验证成功");
        setIsCountingDowm(false);
        setModalNum((v) => v + 1);
      },
      onError: () => {
        message.success("验证失败");
        setModalNum((v) => v + 1);
      },
    }
  );
  // 旧手机号 无需输入直接获取缓存
  const handleOnGetVerificationCodeBtnClick = useCallback(() => {
    sendSMSMutation.mutate(phone_num);
  }, [phone_num, sendSMSMutation]);

  // 新手机号 需要输入，因此需要判定手机号是否表单验证成功
  const NewhandleOnGetVerificationCodeBtnClick = useCallback(() => {
    const Phone = form.validateFields(["phone_num_new"]); // 获取手机号验证状态
    Phone.then((value) => {
      sendSMSMutation.mutate(value.phone_num_new); // 验证成功 发送短信
    }).catch((err) => {
      console.log("err", err); // 验证失败 不发送
    });
  }, [form, sendSMSMutation]);

  // 弹窗表单提交事件 ↓
  const onFinish = useCallback(
    async (values) => {
      // 如果没有下一步内容则最后一次点击关闭弹窗
      if (UpdatePhoneList.length - 1 === ModalNum) {
        // 最后一步
        UpdateByPhoneMutation.mutate(values);
        dispatch.user.updatephone_num(values.phone_num_new);
        onCancel();
        form.resetFields([]);
      } else {
        // 下一步的逻辑
        CheckByPhoneMutation.mutate(values);
      }
    },
    [UpdateByPhoneMutation, CheckByPhoneMutation]
  );

  // 表单内容 ↓
  const UpdatePhoneList = [
    {
      title: "验证手机号",
      FormItemList: [
        {
          FormItemProps: {
            name: "phone_num",
            key: "phone_num",
            initialValue: geTel(phone_num),
          },
          ItemChildProps: {
            placeholder: "手机号码获取失败",
            suffix: (
              <Button
                loading={sendSMSMutation.isLoading || isCountingDowm}
                onClick={handleOnGetVerificationCodeBtnClick}
              >
                {isCountingDowm ? `  ${countValue} s` : "获取验证码"}
              </Button>
            ),
            disabled: true,
          },
        },
        {
          FormItemProps: {
            name: "code",
            key: "code",
            rules: [
              {
                required: true,
                message: "此项必填",
              },
              {
                pattern: /^[\d]+$/,
                message: "只能输入数字",
              },
            ],
          },
          ItemChildProps: {
            placeholder: "请输入验证码",
          },
        },
      ],
    },
    {
      title: "修改手机号",
      FormItemList: [
        {
          FormItemProps: {
            name: "phone_num_new",
            key: "phone_num_new",
            rules: [
              {
                required: true,
                message: "此项必填",
              },
              {
                pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                message: "请输入正确的手机号",
              },
              () => ({
                validator(_, value) {
                  if (!value || phone_num?.toString() !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("跟旧的手机号不能一致!"));
                },
              }),
            ],
          },
          ItemChildProps: {
            placeholder: "请输入手机号码",
            suffix: (
              <Button
                loading={sendSMSMutation.isLoading || isCountingDowm}
                onClick={NewhandleOnGetVerificationCodeBtnClick}
              >
                {isCountingDowm ? `  ${countValue} s` : "获取验证码"}
              </Button>
            ),
          },
        },
        {
          FormItemProps: {
            name: "code_new",
            key: "code_new",
            rules: [
              {
                required: true,
                message: "此项必填",
              },
              {
                pattern: /^[\d]+$/,
                message: "只能输入数字",
              },
            ],
          },
          ItemChildProps: {
            placeholder: "请输入验证码",
          },
        },
      ],
    },
  ];
  return (
    <FormModal
      visible={visible}
      setVisible={setVisible}
      ModalList={UpdatePhoneList}
      ModalNum={ModalNum}
      onFinish={onFinish}
      onCancel={onCancel}
      form={form}
      loading={UpdateByPhoneMutation.isLoading}
    />
  );
};

export default UpdatePhoneModal;
