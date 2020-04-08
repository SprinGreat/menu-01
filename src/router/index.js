import Vue from 'vue'
import VueRouter from 'vue-router'
//懒加载
const Index=()=>import('../views/index/Index');
const Menu=()=>import('../views/menu/Menu');
const MenuContent=()=>import('../views/menu/menucontent/MenuContent');
const MenuComment=()=>import('../views/menu/menucomment/MenuComment');
const UploadMenu=()=>import('../views/menu/uploadmenu/UploadMenu');
const ModifyMenu=()=>import('../views/menu/uploadmenu/ModifyMenu');

const SeasonalMenu=()=>import('../views/seasonalmenu/SeasonalMenu');
const SpringPage=()=>import('../views/seasonalmenu/page/springpage/SpringPage');
const SummerPage=()=>import('../views/seasonalmenu/page/summerpage/SummerPage');
const AutumnPage=()=>import('../views/seasonalmenu/page/autumnpage/AutumnPage');
const WinterPage=()=>import('../views/seasonalmenu/page/winterpage/WinterPage');


const SpringMenuContent=()=>import('../views/seasonalmenu/seasonmenucontent/springmenucontent/SpringMenuContent');
const SummerMenuContent=()=>import('../views/seasonalmenu/seasonmenucontent/summermenucontent/SummerMenuContent');
const AutumnMenuContent=()=>import('../views/seasonalmenu/seasonmenucontent/autumnmenucontent/AutumnMenuContent');
const WinterMenuContent=()=>import('../views/seasonalmenu/seasonmenucontent/wintermenucontent/WinterMenuContent');


const SpringComment=()=>import('../views/seasonalmenu/springcomment/SpringComment');
const SummerComment=()=>import('../views/seasonalmenu/summercomment/SummerComment');
const AutumnComment=()=>import('../views/seasonalmenu/autumncomment/AutumnComment');
const WinterComment=()=>import('../views/seasonalmenu/wintercomment/WinterComment');



const UploadSpring=()=>import('../views/seasonalmenu/upload/uploadspring/UploadSpring');
const UploadSummer=()=>import('../views/seasonalmenu/upload/uploadsummer/UploadSummer');
const UploadAutumn=()=>import('../views/seasonalmenu/upload/uploadautumn/UploadAutumn');
const UploadWinter=()=>import('../views/seasonalmenu/upload/uploadwinter/UploadWinter');


const ModifySpring=()=>import('../views/seasonalmenu/upload/uploadspring/ModifySpring');
const ModifySummer=()=>import('../views/seasonalmenu/upload/uploadsummer/ModifySummer');
const ModifyAutumn=()=>import('../views/seasonalmenu/upload/uploadautumn/ModifyAutumn');
const ModifyWinter=()=>import('../views/seasonalmenu/upload/uploadwinter/ModifyWinter');


const ErrorSearch=()=>import('../views/errorsearch/ErrorSearch');

const HealthyDiet=()=>import('../views/healthydiet/HealthyDiet');
const HealthyDietContent=()=>import('../views/healthydiet/HealthyDietContent');
const HealthyNews=()=>import('../views/healthynews/HealthyNews');
const HealthyNewsContent=()=>import('../views/healthynews/HealthyNewsContent');
const TakeOutFood=()=>import('../views/takeoutfood/TakeOutFood');

const Login=()=>import('../views/login/Login');
const ModifyPassword=()=>import('../views/login/ModifyPassword');
const Register=()=>import('../views/login/Register');



Vue.use(VueRouter);

const routes=[
  {
    path:'',
    redirect:'/index'
  },
  {
    path:'/index',
    component:Index
  },
  {
    path:'/menu',
    component:Menu,
  },
  {
    path:'/menucontent',
    component:MenuContent
  },
  {
    path:'/menucomment',
    component:MenuComment
  },
  {
    path:'/uploadmenu',
    component:UploadMenu
  },
  {
    path:'/modifymenu',
    component:ModifyMenu
  },




  {
    path:'/seasonalmenu',
    component:SeasonalMenu,
    children:[
      // {
      //   path:'',
      //   redirect:'springpage'
      // },
      {
        path:'springpage',
        component:SpringPage
      },
      {
        path:'summerpage',
        component:SummerPage
      },
      {
        path:'autumnpage',
        component:AutumnPage
      },
      {
        path:'winterpage',
        component:WinterPage
      }
    ]
  },
  {
    path:'/springmenucontent',
    component:SpringMenuContent
  },
  {
    path:'/summermenucontent',
    component:SummerMenuContent
  },
  {
    path:'/autumnmenucontent',
    component:AutumnMenuContent
  },
  {
    path:'/wintermenucontent',
    component:WinterMenuContent
  },
  {
    path:'/springcomment',
    component:SpringComment
  },
  {
    path:'/summercomment',
    component:SummerComment
  },
  {
    path:'/autumncomment',
    component:AutumnComment
  },
  {
    path:'/wintercomment',
    component:WinterComment
  },
  {
    path:'/uploadspring',
    component:UploadSpring
  },
  {
    path:'/uploadsummer',
    component:UploadSummer
  },
  {
    path:'/uploadautumn',
    component:UploadAutumn
  },
  {
    path:'/uploadwinter',
    component:UploadWinter
  },

  {
    path:'/modifyspring',
    component:ModifySpring
  },
  {
    path:'/modifysummer',
    component:ModifySummer
  },
  {
    path:'/modifyautumn',
    component:ModifyAutumn
  },
  {
    path:'/modifywinter',
    component:ModifyWinter
  },
  {
    path:'/errorsearch',
    component:ErrorSearch
  },
  {
    path:'/healthydiet',
    component:HealthyDiet
  },
  {
    path:'/healthydietcontent',
    component:HealthyDietContent
  },
  {
    path:'/healthynews',
    component:HealthyNews
  },
  {
    path:'/healthynewscontent',
    component:HealthyNewsContent
  },
  {
    path:'/takeoutfood',
    component:TakeOutFood
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/modifypassword',
    component:ModifyPassword
  },
  {
    path:'/register',
    component:Register
  },
];

const router=new VueRouter({
  routes,
  mode:"history"
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next();
//   } else {
//     let token = localStorage.getItem('token');
//     if (token === null || token === '') {
//       next('/login');
//     } else {
//       next();
//     }
//   }
// });
export default router