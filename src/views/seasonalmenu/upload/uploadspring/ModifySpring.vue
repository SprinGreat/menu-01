<template>
  <div class="box">
    <div class="content">
    菜谱名:<input type="text"  v-model="menuName"><br>
    材料:<textarea rows="10" cols="60" v-model="menuMaterial"></textarea><br>
    步骤:<textarea rows="10" cols="60" v-model="menuContent"></textarea><br>
    <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="getFile($event)"/><br>
    <button @click="submitForm($event)">提交修改</button>
      <router-link tag="button" to="seasonalmenu/springpage" class="back">返回</router-link>
    </div>
  </div>
</template>

<script>
  import {request} from "../../../../network/request";
  export default {
    name: "ModifySpring",
    data() {
      return {
        menuName:"",
        menuMaterial:'',
        menuContent:'',
        file:'',
        menuId:this.$route.query.id,
        pic:''
      };
    },
    methods: {
      getFile(event) {
        this.file = event.target.files[0];
        console.log(this.file);
      },
      submitForm(event) {
        event.preventDefault();
        let param = new FormData(); //创建form对象
        param.append('file', this.file);//通过append向form对象添加数据
        param.append('menuName', this.menuName);
        param.append('menuMaterial', this.menuMaterial);
        param.append('menuContent', this.menuContent);
        param.append('menuId', this.menuId);
        param.append('oldPic', this.pic);
        console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        request({
          url: '/modifySpring',
          method: 'post',
          data: param,
          headers: {'Content-Type': 'multipart/form-data'}
        }).then(res => {
          console.log(res);
          alert("修改成功！");
          this.$router.push({path:'/springmenucontent',query:{id:this.menuId}});
        }).catch(err => {
          alert("修改失败！");
          console.log(err);
        });
      },
    },
    created:function () {
      const obj={
        menuId:this.menuId
      };
      const jon=JSON.stringify(obj);
      request({
        url: '/getSpringPic',
        method:'post',
        data:jon,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then(res=>{
        console.log(res);
        this.pic=res.data.message[0].pic;
        console.log(this.pic);
      }).catch(err=>{
        console.log(err);
      });
    }
  }
</script>

<style scoped>
  .box{
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    margin-top: 10px;
    width: 600px;
    height: 420px;
    border:1px solid #ccc;
    border-radius:10px;
    background-color:#fff;
  }
  .content{
    margin-top: 10px;
    margin-left: 50px;
    font-size: 14px;
    font-family: "黑体","微软雅黑","宋体";
    font-weight: bold;
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
  .back{
    margin-left: 16px;
  }
</style>