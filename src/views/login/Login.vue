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
      <div class="login">
        <button  @click="btnClick">登录</button>
      </div>
      <div class="warning">
        <h5 v-if="passwordError">您输入的密码有误，请重新输入！</h5>
        <h5 v-if="userError">您输入的用户不存在，请重新输入或注册用户！</h5>
      </div>
    </div>
    <div class="register">
      <router-link to="/register" tag="button">注册</router-link>
      <router-link to="/modifypassword" tag="button">修改密码</router-link>
    </div>
  </div>
</template>
<script>
  import {request} from "../../network/request";
  export default {
    name: "Login",
    data(){
      return{
        userError:false,
        passwordError:false,
        obj:{
          name:"",
          pwd:""
        }
      }
    },
    methods:{
      btnClick(){
        this.userError=false;
        this.passwordError=false;
        const jon=JSON.stringify(this.obj);
        // var xmlhttp;
        // if (window.XMLHttpRequest)
        // {// code for IE7+, Firefox, Chrome, Opera, Safari
        //   xmlhttp=new XMLHttpRequest();
        // }
        // else
        // {// code for IE6, IE5
        //   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        // }
        // /*
        // 在IE浏览器中，如果通过Ajax发送GET请求,
        // 那么IE浏览器认为，同一个URL只有一个结果
        //
        // Math.random();
        // new Date().getTime();
        //  */
        // xmlhttp.open("POST","http://localhost:3000/api/conditionFind",true);
        // xmlhttp.setRequestHeader("Content-type","application/json");
        // xmlhttp.send(jon);
        // xmlhttp.onreadystatechange=function () {
        //   if(xmlhttp.readyState===4){
        //     if(xmlhttp.status>=200&&xmlhttp.status<=300||xmlhttp.status===304){
        //       // alert(xmlhttp.responseText);
        //       window.location.href ='http://localhost:8081/index';
        //     }
        //     else{
        //       // alert("请求失败");
        //       window.location.href ='http://localhost:8081/profile';
        //     }
        //   }
        // }
        request({
          url: '/login',
          method:'post',
          data:jon,
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res=>{
          console.log(res);
          localStorage.setItem("token", res.data.token);
          console.log(localStorage.getItem("token"));
          this.$store.commit('addToken',res.data.token);
          this.$store.commit('addName',res.data.name);
          this.$store.commit('changeLogin');
          this.$router.push('/index');
        }).catch(err=>{
          console.log(err.response);
          console.log(typeof err.response.data.error);
          switch(err.response.data.error){
            case true:
              this.passwordError=true;
              break;
            case false:
              this.userError=true;
              break;
          }
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

  .content .panel .login{
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


  .content .register{
    margin-top:15px;
    text-align: center;
  }

  .content .register button{
    width:80px;
    height:30px;
    border:none;
    font-size:14px;
    background-color:#4c6bb2;
    color:#fff;
    font-family: "微软雅黑";
    text-align: center;
    margin-left:30px;

  }
</style>