import axios from "axios";

const url = 'http://localhost:8000';

export const addUser = async (data) => {
  try {
    await axios.post(`${url}/add`, data);
  } catch (error) {
    console.log("Error while addUser API ", error.message)
  }
}

export const getUsers = async () => {
  try {
    const { data } = await axios.get(`${url}/users`);
    return data;
  } catch (error) {
    console.log("Error while get Users API ", error.message)
  }
}

export const setConversation = async (data) => {
  try {
    const res = await axios.post(`${url}/conversation/add`, data);
    return res.data;
  } catch (error) {
    console.log("Error while calling setConversation API ", error.message)
  }
}

export const getConversation = async (data) => {
  try {
    const res = await axios.post(`${url}/conversation/get`, data);
    return res.data;
  } catch (error) {
    console.log("Error while calling getConversation API ", error.message)
  }
}

export const newMessage = async (data) => {
  try {
    await axios.post(`${url}/message/add`, data)
  } catch (error) {
    console.log("Error while calling getConversation API ", error.message)
  }
}

export const getMessages = async (id) => {
  try {
    const res = await axios.get(`${url}/message/get/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error while calling getConversation API ", error.message)
  }
}

export const uploadFile = async (data) => {
  try {
    return await axios.post(`${url}/file/upload`, data);
  } catch (error) {
    console.log('Error while calling uploadFile API ', error);
  }
}