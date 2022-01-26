import React, { useCallback } from "react";
import { Button, Form, message } from "antd";
import { api } from "@/api";
import { useMutation } from "react-query";
import { geTel } from "@/utils/tools";
import { useCountdown } from "@/utils/hooks";
import FormModal from "@/components/formModal/FormModal";


const UpdatePWModal = ({ visible, setVisible, phone_num }) => {

	const [form] = Form.useForm();
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
	}
	const sendSMSMutation = useMutation( // 发送验证码
		async (phone_num) => {
			return api.user.sendSMS(phone_num, "login");
		},
		{
			onSuccess: (data, phone_num) => startCountdown(),
		}
	);

	const handleOnGetVerificationCodeBtnClick = useCallback(() => {
		sendSMSMutation.mutate(phone_num); // 发送验证码的点击事件
	}, [phone_num, sendSMSMutation]);

	const UpdateByPwdMutation = useMutation(
		async ({ code, password }) => {
			return api.user.resetPwd(phone_num, code, password);
		},
		{
			onSuccess: () => {
				message.success("修改成功");
				setIsCountingDowm(false);
				onCancel();
			},
		}
	);
	// 弹窗表单提交事件 ↓
	const onFinish = useCallback(
		async values => {
			UpdateByPwdMutation.mutate({ ...values });
		}, [UpdateByPwdMutation]
	);
	// 表单内容 ↓
	const UpdatePWList = [{
		title: "修改密码",
		FormItemList: [
			{
				FormItemProps: {
					name: "phone_num",
					key: "phone_num",
					initialValue: geTel(phone_num)
				},
				ItemChildProps: {
					placeholder: "手机号码获取失败",
					suffix:
						<Button
							loading={sendSMSMutation.isLoading || isCountingDowm}
							onClick={handleOnGetVerificationCodeBtnClick}>
							{isCountingDowm ? `  ${countValue} s` : "获取验证码"}
						</Button>,
					disabled: true,
				}
			}, {
				FormItemProps: {
					name: "code",
					key: "code",
					rules: [{
						required: true,
						message: "此项必填",
					},
					{
						pattern: /^[\d]+$/,
						message: "只能输入数字"
					}],
				},
				ItemChildProps: {
					placeholder: "请输入验证码",
				}
			}, {
				FormItemProps: {
					name: "password",
					key: "password",
					rules: [{
						required: true,
						message: "此项必填",
					}, {
						pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
						message: "必须为6-12位数字和字母的组合"
					}],
				},
				type: "Password",
				ItemChildProps: {
					placeholder: "请输入6-12位数字和字母组合的密码	",
				}
			}, {
				FormItemProps: {
					name: "password_1",
					key: "password_1",
					rules: [{
						required: true,
						message: "此项必填",
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject(new Error('必须跟第一次输入的新密码相同!'));
						},
					}),
					],
				},
				type: "Password",
				ItemChildProps: {
					placeholder: "再次输入新密码",
				}
			}]
	}];

	return <FormModal
		visible={visible} setVisible={setVisible}
		ModalList={UpdatePWList}
		onCancel={onCancel}
		onFinish={onFinish}
		form={form}
		loading={UpdateByPwdMutation.isLoading}
	/>
}

export default UpdatePWModal;