//引入路由对象
import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router'
// 手机端
import MobileToolPage from '../mobileViews/toolPage.vue';
import MobileJudgePage from '../mobileViews/judgePage.vue';
import MobileContentPage from '../mobileViews/contentPage.vue';

// pc端
import PCToolPage from '../pcViews/toolPage.vue';
import PCJudgePage from '../pcViews/judgePage.vue';

// 路由类型 RouteRecordRaw
// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes: Array<RouteRecordRaw> = [{
  path: '/',
  name: 'index',
  component: () => import('../views/index.vue'),  /* 路由懒加载 */
},



{
  path: '/toolPage',
  name: 'toolPage',
  component: window.innerWidth < 750 ? MobileToolPage : PCToolPage,
},
{
  path: '/judgePage',
  name: 'judgePage',
  component: window.innerWidth < 750 ? MobileJudgePage : PCJudgePage,
},
{
  path: '/contentPage',
  name: 'contentPage',
  component: MobileContentPage,
},
{
  path: '/contentTextPage',
  name: 'contentTextPage',
  component: () => import('../mobileViews/contentTextPage.vue'),
},
{
  path: '/searchPage',
  name: 'searchPage',
  component: () => import('../mobileViews/searchPage.vue'),
},
{
  path: '/editPage',
  name: 'editPage',
  component: () => import('../mobileViews/editPage.vue'),
},
{
  path: '/addMenuPage',
  name: 'addMenuPage',
  component: () => import('../mobileViews/addMenuPage.vue'),
}, {
  path: '/editToolPage',
  name: 'editToolPage',
  component: () => import('../mobileViews/editToolPage.vue'),
},
{
  path: '/addToolMenuPage',
  name: 'addToolMenuPage',
  component: () => import('../mobileViews/addToolMenuPage.vue'),
},

]

/* 路由模式 
  createWebHistory: h5
  createWebHashHistory: HASH
  createMemoryHistory: 服务端渲染时
*/

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

//导出router
export default router
