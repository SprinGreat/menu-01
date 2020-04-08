import axios from 'axios'
export function request(config) {
  //1创建axios的实例
  const instance=axios.create({
    baseURL:'http://localhost:3000/api',
  });
  //2.axios的拦截器
  //2.1请求拦截
  instance.interceptors.request.use(config=>{
    if (localStorage.getItem("token")) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers['authorization'] = 'authorization'+' ' + localStorage.getItem("token");
    }
      return config;
  },err=>{
    return Promise.reject(err);
  });


  //2.2响应拦截
  // instance.interceptors.response.use(res=>{
  //   // console.log(res);
  //   //最后要把res返回出去
  //   return res.data;
  // },err=>{
  //   console.log(err);
  // });

  //3.发送真正的网络请求
  return instance(config);
}
