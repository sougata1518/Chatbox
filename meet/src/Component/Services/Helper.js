import axios from "axios";

export const BASE_URL = 'http://localhost:8080';
export const MyAxios = axios.create({
    baseURL:BASE_URL
})