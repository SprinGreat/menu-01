<template>
  <div class="top-nav-bar">
    <span>来逛吃，选美味，开启味蕾全新旅程</span>
    <ul class="log-reg" v-if="isLogin===false">
      <li>
      <router-link to="/login">登录</router-link>
      </li>
      <li><router-link to="/register">注册</router-link></li>
    </ul>
    <ul class="log-reg" v-else>
      <li>
        <span>欢迎你，{{name}}！</span>
      </li>
      <li><a @click="outLogin">退出登录</a></li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "TopNavBar",
   computed:{
      isLogin(){
        return this.$store.state.isLogin;
      },
     name(){
       return this.$store.state.name;
     }
   },
    methods:{
      outLogin(){
        this.$store.commit('removeTokenName');
      }
    },
  }
</script>

<style scoped>
  .top-nav-bar{
    height: 50px;
    width: 100%;
    background-color: #C90000;
    line-height: 50px;
  }
  .top-nav-bar>span{
    font-size:15px;
    color:#fff;
    margin-right:460px;
    margin-left:30px;
    float:left;
  }
  .top-nav-bar ul{
    text-align: center;
    line-height: 50px;
    list-style: none;
    font-size:14px;
  }
  .top-nav-bar ul li{
    float:left;
    margin-right:10px;
  }
  .top-nav-bar a{
    color:#fff;
    text-decoration: none;
    cursor:pointer;
  }
  .top-nav-bar span{
    color:#fff;
    text-decoration: none;
    cursor:pointer;
  }
</style>