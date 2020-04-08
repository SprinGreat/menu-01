<template>
  <div id="app">
    <main-nav-bar></main-nav-bar>
    <router-view></router-view>
  </div>
</template>
<script>
  import MainNavBar from 'components/content/mainnavbar/MainNavBar'
export default {
  name: 'App',
  components: {
    MainNavBar,
  }
}
</script>
<style>
 @import "./assets/css/base.css";
</style>
