<template>
<div class="box">
  <div class="box1">
    <a href="https://www.meituan.com/">
    <img src="../../assets/img/takeoutfood/meituan.png">
    </a>
    <br>
    <a href="https://www.meituan.com/">美团</a>
  </div>
  <div class="box2">
    <a href="https://e.ele.me/">
    <img src="../../assets/img/takeoutfood/ele.png">
    </a>
    <br>
    <a href="https://e.ele.me/">饿了么</a>
  </div>
</div>
</template>

<script>
  export default {
    name: "TakeOutFood"
  }
</script>

<style scoped>
.box{
  width: 100%;
  display: flex;
  flex-direction: row
}
  .box>div{
    flex:1;
    text-align: center;
  }
  img{
    width: 400px;
    height: 400px;
  }
a{
  color: #000000;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
}
</style>