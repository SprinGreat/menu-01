<template>
  <div class="content">
    <div class="panel">
      <div class="group">
        <ul>
          <li><label>用户名</label></li>
          <li><input type="text"  v-model="obj.name" placeholder=" 请输入用户名"></li>
        </ul>
        <ul>
          <li><label>密码</label></li>
          <li><input type="password"  v-model="obj.pwd" placeholder=" 请输入密码" ></li>
        </ul>
      </div>
      <div class="register">
        <button  @click="btnClick">注册</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  export default {
    name: "Register",
    data() {
      return {
        obj: {
          name: "",
          pwd: ""
        }
      }
    },
    methods:{
      btnClick() {
        const jon = JSON.stringify(this.obj);
        request({
          url: '/add',
          method:'post',
          data:jon,
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res=>{
          console.log(res);
          this.$router.push('/login');
        }).catch(err=>{
          console.log(err);
          this.$router.push('/register');
        });
      }
      }
  }
</script>

<style scoped>
  .content{
    /*border:1px solid red;*/
    width:300px;
    margin-top:50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .content .panel{
    border:1px solid #ccc;
    border-radius:5px;
    height:220px;
    background-color:#fff;
  }
  .content .panel .group{
    margin:30px 10px 10px 20px;
  }
  .content .panel .group ul{
    list-style: none;
    margin-top:15px;
  }

  .content .panel .group ul li{
    margin-top:2px;
  }

  .content .panel .group ul li input{
    line-height:22px;
    width:250px;
    font-size: 14px;
    font-family: "微软雅黑","宋体";
  }
  .content .panel .group ul li label{
    font-size: 14px;
    font-family: "黑体","微软雅黑","宋体";
    font-weight: bold;
  }

  .content .panel .register{
    text-align: center;
    /*border:1px solid red;*/
    margin-top:20px;

  }
  .content button{
    width:255px;
    height:30px;
    background-color:#008000;
    border:none;
    color:#fff;
    font-size:16px;
    font-weight: bold;
    cursor:pointer;
  }


</style>