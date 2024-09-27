/** @format */
import {
	VerifyEmailApi,
	VerifyOTPApi,
	ResetPasswordApi
} from "../api";
import Instance from "../axios";

const API_URL = process.env.REACT_APP_API;

const postVerifyEmail = async (data) => {
	try {
		const response = await Instance.post(API_URL + VerifyEmailApi, data);
		return response;
	} catch (error) {
		throw error;
	}
};

const VerifyOTP = async (data) => {
	try {
		const response = await Instance.post(API_URL + VerifyOTPApi, data);
		return response;
	} catch (error) {
		throw error;
	}
};

const ResetPassword = async (data) => {
	try {
		const response = await Instance.post(API_URL + ResetPasswordApi, data);
		return response;
	} catch (error) {
		throw error;
	}
};

export {
	postVerifyEmail,
	VerifyOTP,
	ResetPassword
};