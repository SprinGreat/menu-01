<template>
  <div class="box">
    <section id="main">
      <h1>当季菜谱</h1>
      <ul>
        <li><router-link to="/seasonalmenu/springpage">春季</router-link></li>
        <li><router-link to="/seasonalmenu/summerpage">夏季</router-link></li>
        <li><router-link to="/seasonalmenu/autumnpage">秋季</router-link></li>
        <li><router-link to="/seasonalmenu/winterpage">冬季</router-link></li>
      </ul>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
  export default {
    name: "SeasonalMenu"
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
  ul{
    margin-top: 30px;
    margin-left: 200px;
    text-align: center;
  }
   ul>li{
     float:left;
     list-style: none;
     margin: 0 28px;
     background-color: #f6652c;
     width: 50px;
     height: 50px;
     line-height: 50px;
     border-radius: 50px;
   }
  ul>li>a{
    text-decoration: none;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }

  ul>li>a:hover{
    color: black;
  }
</style>