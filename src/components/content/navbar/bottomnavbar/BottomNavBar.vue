<template>
  <div class="bottom-nav-bar">
    <ul class="lf">
      <nav-bar-item path="/index">
        <li>
          <a style="cursor:pointer">
          首页
          </a>
        </li>
      </nav-bar-item>
      <nav-bar-item path="/menu">
        <li>
          <a style="cursor:pointer">
         菜谱大全
          </a>
        </li>
      </nav-bar-item>
      <nav-bar-item path="/seasonalmenu">
        <li>
          <a style="cursor:pointer">
            当季菜谱
          </a>
        </li>
      </nav-bar-item>
      <nav-bar-item path="/healthydiet">
        <li>
          <a style="cursor:pointer">
            饮食健康
          </a>
        </li>
      </nav-bar-item>
      <nav-bar-item path="/healthynews">
        <li>
          <a style="cursor:pointer">
            健康资讯
          </a>
        </li>
      </nav-bar-item>
      <nav-bar-item path="/takeoutfood">
        <li>
          <a style="cursor:pointer">
            外卖
          </a>
        </li>
      </nav-bar-item>
    </ul>
  </div>
</template>

<script>
  import NavBarItem from './BottomNavBarItem/NavBarItem'
  export default {
    name: "BottomNavBar",
    components:{
      NavBarItem
    }
  }
</script>

<style scoped>
  .bottom-nav-bar{
    height: 40px;
    width: 100%;
    background-color:#F6652C;
    border:none;
    box-sizing:border-box;
    padding:0 20px;
    text-align:center;
    margin-bottom:5px;
  }

  .bottom-nav-bar ul.lf{
    line-height:40px;
    list-style: none;
  }
  .bottom-nav-bar ul.lf li{
    float:left;
    margin-right:35px;
    color:#fff;
    font-size:18px;
    font-weight:bold;
  }
</style>