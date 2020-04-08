import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store=new Vuex.Store({
  state:{
    name:'',
    token:'',
    isLogin:false,
    menuCollectId:[],
    springCollectId:[],
    summerCollectId:[],
    autumnCollectId:[],
    winterCollectId:[]
  },
  mutations:{
    addToken(state,token){
       state.token=token;
    },
    addName(state,name){
      state.name=name;
    },
    changeLogin(state){
      state.isLogin=true;
    },
    removeTokenName(state){
      state.name='';
      state.token='';
      state.isLogin=false;
      state.menuCollectId=[];
      state.springCollectId=[];
      state.summerCollectId=[];
      state.autumnCollectId=[];
      state.winterCollectId=[];
      localStorage.removeItem('token');
    },
    addMenuCollectId(state,menuId){
      state.menuCollectId.push(menuId);
    },
    addSpringCollectId(state,menuId){
      state.springCollectId.push(menuId);
    },
    addSummerCollectId(state,menuId){
      state.summerCollectId.push(menuId);
    },
    addAutumnCollectId(state,menuId){
      state.autumnCollectId.push(menuId);
    },
    addWinterCollectId(state,menuId){
      state.winterCollectId.push(menuId);
    },
  },
  actions:{
    // aaddToken(context,token){
    //
    // },
    // aaddName(context,name){
    //
    // }
  },
  getters:{
  }
});





export default store