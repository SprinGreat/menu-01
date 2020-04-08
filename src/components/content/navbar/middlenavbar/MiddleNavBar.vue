<template>
  <div class="middle-nav-bar">
    <div id="logo">
      <img src="../../../../assets/img/middlenavbar/logo.png" class="logo">
      <input v-model="obj.menuName" type="search" name="search"  placeholder="搜索属于你的美味">
      <button style="cursor:pointer" @click="searchBtn">搜索</button>
      </div>
  </div>
</template>

<script>
  import {request} from "../../../../network/request";
  export default {
    name: "MiddleNavBar",
    data(){
      return{
        obj:{
          menuName:''
        },
      }
    },
    methods:{
      searchBtn(){
        const jon=JSON.stringify(this.obj);
        request({
          url: '/searchMenu',
          method:'post',
          data:jon,
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res=>{
          console.log(res);
          const type=res.data.message[0].type;
          const menuId=res.data.message[0].menuId;
          switch(type){
            case 0:
              this.$router.push({path:'/menucontent',query:{id:menuId}});
              break;
            case 1:
              this.$router.push({path:'/springmenucontent',query:{id:menuId}});
              break;
            case 2:
              this.$router.push({path:'/summermenucontent',query:{id:menuId}});
              break;
            case 3:
              this.$router.push({path:'/autumnmenucontent',query:{id:menuId}});
              break;
            case 4:
              this.$router.push({path:'/wintermenucontent',query:{id:menuId}});
              break;
          }
        }).catch(err=>{
          console.log(err);
          this.$router.push('/errorsearch');
        });
      }
    },
    created(){
      if (localStorage.getItem("store")) {
        this.$store.replaceState(
            Object.assign(
                {},
                this.$store.state,
                JSON.parse(localStorage.getItem("store"))
            )
        );
        localStorage.removeItem("store")
      }
      //在页面刷新时将vuex里的信息保存到localStorage里
      window.addEventListener("beforeunload", () => {
        localStorage.setItem("store", JSON.stringify(this.$store.state));
      });
    }
  }
</script>

<style scoped>
  .middle-nav-bar{
    width: 100%;
    height:68px;
    border:none;
    box-sizing:border-box;
  }
  #logo{
    margin-left: 60px;
  }
  #logo>img.logo{
    width:200px;
    margin:10px 15px;
    float:left;
  }
  .middle-nav-bar input{
    margin:15px 20px;
    width:280px;
    height:30px;
    padding-left:10px;
    outline:none;
    border:2px solid #F6652C;
    float:left;
    position:relative;
  }
  #logo>button{
    border:2px solid #F6652C;
    background-color:#F6652C;
    height:30px;
    width:55px;
    color:#fff;
    font-size:14px;
    border-radius:5px;
    float:left;
    margin-top:15px;
  }
</style>