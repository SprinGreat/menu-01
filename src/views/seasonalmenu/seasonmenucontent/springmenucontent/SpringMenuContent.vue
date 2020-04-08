<template>
  <div>
    <div class="box1">
      <h1>{{content[0].menuName}}</h1>
      <img :src="content[0].pic">
    </div>
    <div class="box2">
      <h2>用料:</h2>
      <h3>{{content[0].menuMaterial}}</h3>
      <h2>做法:</h2>
      <h3><ul v-for="item in step">
        <li>{{item}}</li>
      </ul></h3>
    </div>
    <div>
      <ul v-for="item in comment">
        <li><span>{{item.name}}</span>:<span>{{item.comment}}</span><button @click="deleteComment(item.commentId)">删除评论</button><hr></li>
      </ul>
    </div>
    <p class="detailBottom">
      <button @click="collectBtn(content[0].menuId)" v-if="$store.state.springCollectId.indexOf(parseInt(content[0].menuId))===-1">收藏</button>
      <button @click="cancelCollectBtn(content[0].menuId)" v-else>取消收藏</button>
      <router-link tag="button" :to="{path:'/springcomment',query:{id:content[0].menuId}}">评论</router-link>
      <button v-if="isUser" @click="deleteMenu">删除菜谱</button>
      <router-link v-if="isUser" tag="button" :to="{path:'/modifyspring',query:{id:content[0].menuId}}">修改菜谱</router-link>
      <router-link tag="button" to="/seasonalmenu/springpage">返回</router-link>
    </p>
  </div>
</template>

<script>
  import {request} from "../../../../network/request";
  export default {
    name: "SpringMenuContent",
    data(){
      return{
        comment:[],
        content:[],
        step:[],
        obj:{
          menuId:this.$route.query.id,
          pic:''
        },
        isUser:false,
      }
    },
    methods:{
      collectBtn(menuId) {
        if(localStorage.getItem('token')){
          this.$store.commit('addSpringCollectId', menuId);
          const obj = {
            menuId: menuId
          };
          const jon = JSON.stringify(obj);
          request({
            url: '/springCollect',
            method: 'post',
            data: jon,
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
          }).then(res => {
            console.log(res);
            alert("收藏成功！");
          }).catch(err => {
            alert("您已经收藏该菜谱了！");
            console.log(err);
          });
        }
       else{
          this.$router.push('/login');
        }
      },
      cancelCollectBtn(menuId) {
        //取消收藏菜谱，从菜谱数组中删除
        Array.prototype.remove = function (val) {
          for (var i = 0; i < this.length; i++) {
            if (this[i] == val) this.splice(i, 1);
          }
        };
        this.$store.state.springCollectId.remove(parseInt(menuId));
        const obj = {
          menuId: menuId
        };
        const jon = JSON.stringify(obj);
        request({
          url: '/cancelSpringCollect',
          method: 'post',
          data: jon,
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res => {
          console.log(res);
          alert("该菜谱已取消收藏！");
        }).catch(err => {
          console.log(err);
        });
      },
      deleteComment(commentId){
        const obj = {
          commentId:commentId
        };
        const jon = JSON.stringify(obj);
        request({
          url: '/deleteSpringComment',
          method: 'post',
          data: jon,
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res => {
          console.log(res);
          alert("删除评论成功！");
          location.reload();
        }).catch(err => {
          console.log(err);
        });
      },
      deleteMenu(){
        const jon=JSON.stringify(this.obj);
        request({
          url: '/deleteSpring',
          method:'post',
          data:jon,
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res=>{
          console.log(res);
          alert("该菜谱已经删除成功了");
          this.$router.push('/seasonalmenu/springpage');
        }).catch(err=>{
          console.log(err);
        });
      }
    },
    created:function () {
      const jon=JSON.stringify(this.obj);
      request({
        url: '/springContentShow',
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

      request({
        url: '/existSpringUser',
        method:'post',
        data:jon,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then(res=>{
        console.log(res);
        console.log(typeof res.data.isUser);
        this.isUser=res.data.isUser;
        this.obj.pic=res.data.message[0].pic;
        console.log(this.obj.pic);
      }).catch(err=>{
        console.log(err);
      });


      request({
        url: '/springCommentShow',
        method:'post',
        data:jon,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then(res=>{
        console.log(res.data.message);
        this.comment=res.data.message;
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
    margin:10px;
    border:2px solid #F6652C;
    background-color:#F6652C;
    height:30px;
    width:60px;
    color:#fff;
    font-size:14px;
    border-radius:5px;
  }
  img{
    width: 400px;
    height: 266px;
  }
</style>