<template>
  <div class="box">
  <section id="main">
    <div class="title">
      <h1>帮助你了解更多的饮食小常识</h1>
    </div>
    <div class="main-img">
      <div class="kld-list" v-for="item in arr">
        <router-link :to="{path:'/healthynewscontent',query:{id:item.newsId}}">
        <img :src="item.pic" class="keyframes">
        </router-link>
        <div class="user-info">
          <ul>
            <li><router-link :to="{path:'/healthynewscontent',query:{id:item.newsId}}" class="title-point">{{item.newsName}}</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  export default {
    name: "HealthyNews",
    data(){
      return{
        arr:[]
      }
    },
    created:function () {
      request({
        url: '/healthynews',
        method:'get',
      }).then(res=>{
        console.log(res);
        this.arr=res.data.message;
        console.log(this.arr);
      }).catch(err=>{
        console.log(err);
      });
    }
  }
</script>

<style scoped>
  .box{
    padding: 0 200px;
  }
  #main{
    width:990px;
    min-height:300px;
    box-sizing: border-box;
    padding: 5px;
  }
  #main h1{
    text-align: center;
  }
  #main div p{
    float:right;
    line-height:24px;
  }
  div.title h1{
    margin-top: 10px;
  }
  #main div.main-img{
    width:1080px;
    min-height:200px;
    margin:35px 0 10px 60px;
    display:flex;
    flex-wrap:wrap;
  }
  div.kld-list{
    margin-right: 50px;
  }
  div.user-info ul{
    width:232px;
    text-align: center;
    border:1px solid #ddd;
    border-top:0;
    padding:2px;
    box-sizing: border-box;
    margin-bottom:10px;
    list-style: none;
  }
  div.user-info ul li{
    margin:5px 0;
  }
  div.user-info ul a.title-point{
    font-size: 14px;
    color:#000;
    font-weight: bold;
    text-decoration: none;
  }
</style>