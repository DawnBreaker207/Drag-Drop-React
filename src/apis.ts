import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8888/api/v1',
  // headers: {
  //   'Content-Type': 'multipart/form-data',
  // },
});
export default instance;
