<template>
  <div class="box1">
    <textarea rows="5" cols="30" v-model="obj.comment"></textarea>
    <br>
    <button @click="btnSubmit" class="btn1">提交评论</button>
    <router-link to="/seasonalmenu/autumnpage" tag="button">返回</router-link>
  </div>
</template>

<script>
  import {request} from "../../../network/request";
  export default {
    name: "AutumnComment",
    data(){
      return{
        obj:{
          comment:'',
          menuId:this.$route.query.id
        }
      }
    },
    methods:{
      btnSubmit(){
        if(localStorage.getItem('token')){
          const jon = JSON.stringify(this.obj);
          request({
            url: '/autumnComment',
            method: 'post',
            data: jon,
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
          }).then(res => {
            console.log(res.data.message);
            alert("评论成功");
            this.$router.push({path:'/autumnmenucontent',query:{id:this.obj.menuId}})
          }).catch(err => {
            console.log(err);
          });
        }
        else{
          this.$router.push('/login');
        }
      }
    }
  }
</script>

<style scoped>
  .box1{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .btn1{
    margin-left: 108px;
    margin-right: 10px;
  }
  button{
    border:2px solid #F6652C;
    background-color:#F6652C;
    height:30px;
    width:70px;
    color:#fff;
    font-size:14px;
    border-radius:5px;
  }
</style>