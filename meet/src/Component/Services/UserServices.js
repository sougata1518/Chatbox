import { MyAxios } from "./Helper"


export const setUser = async (User) => {
    return await MyAxios.post(`/saveUser`,User)
    .then(response=>response.data)
}

export const getAllUser = async () => {
    return await MyAxios.get(`/getUsers`)
    .then(response=>response.data)
}

export const requestCall = async (request) => {
    return await MyAxios.post(`/call/request`,request)
    .then(response=>response.data)
}

export const getStatus = async (username) => {
  try {
    const response = await MyAxios.get(`/call/status/${username}`);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null;
    }
    throw err;
  }
};


export const responseCall = async (response) => {
    return await MyAxios.post(`/call/respond`,response)
    .then(response=>response.data)
}

export const clearCall = async (username) => {
    return await MyAxios.delete(`/call/clear/${username}`)
    .then(response=>response.data)
}