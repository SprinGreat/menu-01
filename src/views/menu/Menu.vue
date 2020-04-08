<template>
  <!--主体部分图片为主-->
  <div class="box">
  <section id="main">
    <h1>吃饭不积极，思想有问题</h1>
   <span>
      <router-link to="/uploadmenu" tag="button">发布菜谱</router-link>
    </span>
    <div class="box1">
      <div class="a-user right-user" v-for="value in currentPageData">
        <router-link :to="{path:'/menucontent',query:{id:value.menuId}}">
          <div class="picture">
            <img :src="value.pic"  class="animated ">
            <b></b>
          </div>
        </router-link>
        <div class="user-infro">
          <dl class="name-menu">
            <dt><span>NO.{{value.menuId}}</span><router-link :to="{path:'/menucontent',query:{id:value.menuId}}">{{value.menuName}}</router-link></dt>
          </dl>
          <button @click="collectBtn(value.menuId)" v-if="$store.state.menuCollectId.indexOf(parseInt(value.menuId))===-1">收藏</button>
          <button @click="cancelCollectBtn(value.menuId)" v-else>取消收藏</button>
          <router-link tag="button" :to="{path:'/menucomment',query:{id:value.menuId}}">评论</router-link>
        </div>
      </div>
    </div>
    <p class="pages">
      <button @click="prevPage()">
        上一页
      </button>
      <span>第{{currentPage}}页/共{{totalPage}}页</span>
      <button @click="nextPage()">
        下一页
      </button>
    </p>
  </section>
  </div>
</template>
<script>
  import {request} from "../../network/request";
  export default {
    name: "Menu",
    data() {
      return {
        //用户收藏的菜谱id
        collectMenuList:[],

        menuList: [], //所有数据
        totalPage: 1, // 统共页数，默认为1
        currentPage: 1, //当前页数 ，默认为1
        pageSize: 9, // 每页显示数量
        currentPageData: [],//当前页显示内容
      }
    },
    methods: {
      // 设置当前页面数据，对数组操作的截取规则为[0~9],[10~19]...,
      // 当currentPage为1时，我们显示(0*pageSize+1)-1*pageSize，当currentPage为2时，我们显示(1*pageSize+1)-2*pageSize...
      getCurrentPageData() {
        let begin = (this.currentPage - 1) * this.pageSize;
        let end = this.currentPage * this.pageSize;
        this.currentPageData = this.menuList.slice(begin, end);
      },
      //上一页
      prevPage() {
        console.log(this.currentPage);
        if (this.currentPage == 1) {
          return false;
        } else {
          this.currentPage--;
          this.getCurrentPageData();
        }
      },
      // 下一页
      nextPage() {
        if (this.currentPage == this.totalPage) {
          return false;
        } else {
          this.currentPage++;
          this.getCurrentPageData();
        }
      },
      collectBtn(menuId) {
        if(localStorage.getItem('token')){
          this.$store.commit('addMenuCollectId', menuId);
          const obj = {
            menuId: menuId
          };
          const jon = JSON.stringify(obj);
          request({
            url: '/menuCollect',
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
        this.$store.state.menuCollectId.remove(parseInt(menuId));
        const obj = {
          menuId: menuId
        };
        const jon = JSON.stringify(obj);
        request({
          url: '/cancelMenuCollect',
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
    },
    created: function () {
      request({
        url: '/menuShow',
        method: 'get',
      }).then(res => {
        console.log(res);
        this.menuList = res.data.message;
        // 计算一共有几页
        this.totalPage = Math.ceil(this.menuList.length / this.pageSize);
        // 计算得0时设置为1
        this.totalPage = this.totalPage == 0 ? 1 : this.totalPage;
        this.getCurrentPageData();
      }).catch(err => {
        console.log(err);
      });
      if(localStorage.getItem("token")){
        request({
          url: '/menuCollected',
          method: 'get',
        }).then(res => {
          console.log(res);
          this.collectMenuList=res.data.message;
          for(let item of this.collectMenuList){
            this.$store.commit('addMenuCollectId',item.collectId);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>

<style scoped>
  .box{
    padding: 0 200px;
  }
  section#main{
    width:990px;
    min-height:300px;
    display:flex;
    flex-wrap:wrap;
    box-sizing:border-box;
    padding:10px 0 0 5px;
  }
  section#main>span{
    margin-top: 30px;
    margin-left: 350px;
  }
  section#main>span>button{
    font-size:14px;
    font-style:normal;
    color:#fff;
    background-color:#F6652C;
    padding:5px 15px;
  }
  .box1{
    width:990px;
    min-height:300px;
    display:flex;
    flex-wrap:wrap;
    box-sizing:border-box;
    padding:10px 0 0 5px;
  }
  div.a-user{
    width:33%;
    min-height:300px;
    margin:10px 0 0 0;
    box-sizing: border-box;
  }
  div.right-user{
    margin-right:0;
  }
  div.picture{
    width: 100%;
    min-height:150px;
    position: relative;
  }
  div.picture img{
    width:310px;
    height:206px;
  }
  div.picture img:hover{
    transform: scale(1.1);
  }

  div.user-infro{
    width:310px;
    box-sizing: border-box;
    padding:10px 5px 0 5px;
    display: flex;
    border:1px solid#E0F1EE;
    box-shadow: 0 0 0 #E0F1EE;
  }
  div.user-infro a{
        margin-right:20px;
        text-decoration: none;
        color: #66666A;
      }
  div.user-infro>button{
    margin-right:15px;
    border:2px solid #F6652C;
    background-color:#F6652C;
    height:30px;
    width:70px;
    color:#fff;
    font-size:13px;
    border-radius:5px;
  }
  dl.name-menu{
    width:60%;
    line-height:2;
    font-size: 14px;
  }
  dl.name-menu dd{
    text-align:left;
    margin-left:0;
    font-size: 12px;
  }
  /*页码*/
  p.pages{
    text-align:center;
    margin:15px auto;
  }
  p.pages button{
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
  #mian>p{
    margin:50px 0 50px 80px;
  }

</style>