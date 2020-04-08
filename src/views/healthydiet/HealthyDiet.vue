<template>
  <div>
  <section id="main">
    <div class="menu-text">
      <h2><a href="#">功能调理菜谱</a>
      </h2>
      <div class="content" v-for="item in arr1">
        <router-link :to="{path:'/healthydietcontent',query:{id:item.menuId}}">
        <img :src="item.pic">
        </router-link>
        <ul class="infromation">
          <router-link :to="{path:'/healthydietcontent',query:{id:item.menuId}}">
          <li><b>{{item.menuName}}</b></li>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="menu-text">
      <h2><a href="#">功能调理菜谱</a>
      </h2>
      <div class="content" v-for="item in arr2">
        <router-link :to="{path:'/healthydietcontent',query:{id:item.menuId}}">
        <img :src="item.pic">
        </router-link>
        <ul class="infromation">
          <router-link :to="{path:'/healthydietcontent',query:{id:item.menuId}}">
          <li><b>{{item.menuName}}</b></li>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="menu-text">
      <h2><a href="#">功能调理菜谱</a>
      </h2>
      <div class="content" v-for="item in arr3">
        <router-link :to="{path:'/healthydietcontent',query:{id:item.menuId}}">
        <img :src="item.pic">
        </router-link>
        <ul class="infromation">
          <router-link :to="{path:'/healthydietcontent',query:{id:item.menuId}}">
          <li><b>{{item.menuName}}</b></li>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="menu-text">
      <h2><a href="#">功能调理菜谱</a>
      </h2>
      <div class="content" v-for="item in arr4">
        <router-link :to="{path:'/healthydietcontent',query:{id:item.menuId}}">
        <img :src="item.pic">
        </router-link>
        <ul class="infromation">
          <router-link :to="{path:'/healthydietcontent',query:{id:item.menuId}}">
          <li><b>{{item.menuName}}</b></li>
          </router-link>
        </ul>
      </div>
    </div>
  </section>
    <p class="detailBottom">
      <router-link tag="button" to="/index">返回首页</router-link>
    </p>
  </div>
</template>

<script>
  import {request} from "../../network/request";
  export default {
    name: "HealthyDiet",
    data(){
      return{
         arr:[],
         arr1:[],
         arr2:[],
         arr3:[],
         arr4:[]
      }
    },
    created:function () {
      function group(array, subGroupLength) {
        let index = 0;
        let newArray = [];
        while(index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
      }
      request({
        url: '/healthydiet',
        method:'get',
      }).then(res=>{
        this.arr=group(res.data.message,5);
        this.arr1=this.arr[0];
        this.arr2=this.arr[1];
        this.arr3=this.arr[2];
        this.arr4=this.arr[3];
      }).catch(err=>{
        console.log(err);
      });
    }
  }
</script>

<style scoped>
  #main{
    min-height:300px;
    border-top:none;
  }
  #main div.menu-text{
    margin:20px 0 10px 10px;
    display:flex;
    flex-wrap:wrap;
  }
  div.menu-text div{
    width:185px;
    min-height:195px;
    border:1px solid #ddd;
    box-sizing: border-box;
    margin:40px 15px 10px 0;
  }
  div.menu-text h2{
    margin-bottom: 10px;
  }
  a{
    color: #000000;
    text-decoration: none;
  }
  div.menu-text h2>a{
    color: #66666A;
  }
  div.menu-text img{
    width:180px;
    vertical-align: top;
    margin-left:2px;
  }
  ul.infromation{
    text-align: center;
    list-style: none;
  }
  ul.infromation li{
    margin:10px 0;
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