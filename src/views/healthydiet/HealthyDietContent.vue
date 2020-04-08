<template>
  <div>
    <div class="box1">
      <h1>{{content[0].menuName}}</h1>
      <img :src="content[0].pic">
    </div>
    <div class="box2">
      <h2>功效:</h2>
      <h3>{{content[0].menuEffect}}</h3>
      <h2>用料:</h2>
      <h3>{{content[0].menuMaterial}}</h3>
      <h2>做法:</h2>
      <h3><ul v-for="item in step">
        <li>{{item}}</li>
      </ul></h3>
    </div>
    <p class="detailBottom">
      <router-link tag="button" to="/healthydiet">返回</router-link>
    </p>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  export default {
    name: "HealthyDietContent",
    data(){
      return{
        content:[],
        step:[],
        obj:{
          menuId:this.$route.query.id,
        },
      }
    },
    created:function () {
      const jon=JSON.stringify(this.obj);
      request({
        url: '/healthydietcontent',
        method:'post',
        data:jon,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then(res=>{
        console.log(res);
        this.content=res.data.message;
        this.step=this.content[0].menuContent.split('。');
      }).catch(err=>{
        console.log(err);
      });

    }
  }
</script>

<style scoped>
  .box1{
    text-align: center;
  }
  .box2{
    padding: 0 475px;
  }
  .box2 ul{
    list-style: none;
  }
  p.detailBottom{
    text-align:center;
    margin:15px auto;
  }
  p.detailBottom a{
    display:inline-block;
    min-width:15px;
    min-height:15px;
    border:1px solid #dddddd;
    padding:5px;
    margin:10px;
    border-radius:5px;
    background:#E0F1EE;
    text-decoration: none;
    color: #66666A;
  }
  p.detailBottom button{
    display:inline-block;
    min-width:15px;
    min-height:15px;
    border:1px solid #dddddd;
    padding:5px;
    margin:10px;
    border-radius:5px;
    background:#E0F1EE;
    color: #66666A;
  }
  img{
    width: 232px;
    height: 232px;
  }
</style>