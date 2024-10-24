import axios from "axios";
import tokenservice from "./token.service";

const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log(baseURL);
const instance = axios.create({
  baseURL: baseURL, // เปลี่ยน baseUrL เป็น baseURL
  headers: {
    "Content-Type": "application/json",
  },
});

//add interceptor to request object
 instance.interceptors.request.use((config)=>{
  const token = tokenservice.getLocalAccessToken();
 if(token){
  config.headers['x-access-token'] = token;
 }
 return config;
},(error) =>{
  return Promise.reject(error);
}
);

export default instance;    