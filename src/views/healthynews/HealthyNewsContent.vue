<template>
  <div>
    <div class="box1">
      <h1>{{obj1.newsName}}</h1>
    </div>
    <div class="box2">
      <p>&nbsp;&nbsp;{{obj1.news}}</p>
    </div>
    <p class="detailBottom">
      <router-link tag="button" to="/healthynews">返回</router-link>
    </p>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  export default {
    name: "HealthyNewsContent",
    data(){
      return{
        obj1:{},
        obj:{
          newsId:this.$route.query.id,
        }
      }
    },
    created:function () {
      const jon=JSON.stringify(this.obj);
      request({
        url: '/healthynewscontent',
        method:'post',
        data:jon,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then(res=>{
        console.log(res);
        this.obj1=res.data.message[0];
        console.log(this.obj1);
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
</style>