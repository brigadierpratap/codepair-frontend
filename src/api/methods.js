import axiosApiInstance from "./axiosSetup";

const BASE_URL = "http://localhost:8080/api/v1/";

export const get = async (url) => {
  try {
    const response = await axiosApiInstance.get(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const post = async (url, data) => {
  try {
    const response = await axiosApiInstance.post(`${BASE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
