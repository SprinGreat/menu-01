<template>
  <div class="content">
    <div class="panel" v-if="isUser">
      <div class="group">
        <ul>
          <li><label>用户名</label></li>
          <li><input type="text"  v-model="obj1.name" placeholder=" 请输入用户名"></li>
        </ul>
        <ul>
          <li><label>旧密码</label></li>
          <li><input type="password"  v-model="obj1.oldPwd" placeholder=" 请输入旧密码" ></li>
        </ul>
      </div>
      <div class="modify">
        <button  @click="btnClick">确定</button>
      </div>
      <h5 v-if="isError">您输入的用户名或密码有误，请重新输入！</h5>
    </div>
    <div class="pane2" v-else>
      <div class="group">
        <ul>
          <li><label>新密码</label></li>
          <li><input type="password"  v-model="obj2.newPwd" placeholder=" 请输入新密码"></li>
        </ul>
      </div>
      <div class="modify">
        <button  @click="submitClick">提交修改</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  export default {
    name: "ModifyPassword",
    data() {
      return {
        isError:false,
        isUser:true,
        obj1: {
          name: "",
          oldPwd:"",
        },
        obj2:{
          name:"",
          newPwd:""
        }
      }
    },
    methods:{
      btnClick(){
        const jon = JSON.stringify(this.obj1);
        request({
          url: '/getUser',
          method:'post',
          data:jon,
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res=>{
          console.log(res);
          this.isUser=false;
          this.obj2.name=res.data.message[0].name;
        }).catch(err=>{
          console.log(err.response);
          this.isError=err.response.data.isError;
        });
      },
      submitClick(){
        const jon = JSON.stringify(this.obj2);
        request({
          url: '/modifyPassword',
          method:'post',
          data:jon,
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res=>{
          console.log(res);
          alert("修改密码成功！");
          this.$router.push('/login');
        }).catch(err=>{
          console.log(err.response);
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
  .content .pane2{
    border:1px solid #ccc;
    border-radius:5px;
    height:150px;
    background-color:#fff;
  }
  .content .group{
    margin:30px 10px 10px 20px;
  }
  .content .group ul{
    list-style: none;
    margin-top:15px;
  }

  .content  .group ul li{
    margin-top:2px;
  }

  .content  .group ul li input{
    line-height:22px;
    width:250px;
    font-size: 14px;
    font-family: "微软雅黑","宋体";
  }
  .content  .group ul li label{
    font-size: 14px;
    font-family: "黑体","微软雅黑","宋体";
    font-weight: bold;
  }

  .content  .modify{
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