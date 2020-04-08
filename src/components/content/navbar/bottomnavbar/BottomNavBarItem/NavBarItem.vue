<template>
  <div id="nav-bar-item" @click="itemClick">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "NavBarItem",
    props:{
      path:String
    },
    methods:{
      itemClick(){
        this.$router.push(this.path);
        if(this.path==="/seasonalmenu")
        {
          const that=this;
          function season(){
            const d = new Date(),
                m = d.getMonth() + 1;
            switch(true){
              case m >= 3 && m < 6:
              {
                alert("当前季节为春季，将为您推荐春季菜谱！");
                that.$router.push('/seasonalmenu/springpage');
              }
                break;
              case m >= 6 && m < 9:
              {
                alert("当前季节为夏季，将为您推荐夏季菜谱！");
                that.$router.push('/seasonalmenu/summerpage');
              }
                break;
              case m >= 9 && m < 12:
              {
                alert("当前季节为秋季，将为您推荐秋季菜谱！");
                that.$router.push('/seasonalmenu/autumnpage');
              }
                break;
              default:
              {
                alert("当前季节为冬季，将为您推荐冬季菜谱！");
                that.$router.push('/seasonalmenu/winterpage');
              }
                break;
            }
          }
          season();
        }
      }
    }
  }
</script>

<style scoped>

</style>