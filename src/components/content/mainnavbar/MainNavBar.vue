<template>
  <nav-bar>
    <top-nav-bar></top-nav-bar>
    <middle-nav-bar></middle-nav-bar>
    <bottom-nav-bar></bottom-nav-bar>
  </nav-bar>
</template>

<script>
  import NavBar from '../navbar/NavBar'
  import TopNavBar from '../navbar/topnavbar/TopNavBar'
  import MiddleNavBar from '../navbar/middlenavbar/MiddleNavBar'
  import BottomNavBar from '../navbar/bottomnavbar/BottomNavBar'
  export default {
    name: "MainNavBar",
    components:{
      NavBar,
      TopNavBar,
      MiddleNavBar,
      BottomNavBar
    }
  }
</script>
<style scoped>

</style>