import Vue from 'vue';
import Router from 'vue-router';
/* Layout */
import Layout from '../views/layout/Layout';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: false,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '仪表盘', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/RedNoteCrawler',
    component: Layout,
    redirect: '/RedNoteCrawler/RedNoteHomepage',
    name: 'RedNoteCrawler',
    meta: { title: '小红书爬虫', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'crawler',
        name: 'RedNoteHomepage',
        component: () =>
          import('@/views/crawling/RedNoteCrawler/RedNoteHomepage'),
        meta: { title: '小红书首页爬虫', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/maoyanRankingList',
    component: Layout,
    redirect: '/maoyanRankingList/maoyanRankingList',
    name: 'maoyanRankingListLayout',
    meta: { title: '猫眼影库爬虫', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'crawler',
        name: 'maoyanRankingList',
        component: () => import('@/views/crawling/MaoyanRankingList'),
        meta: { title: '排行榜爬虫', icon: 'iconfont icon-mail' }
      },
      {
        path: 'ratingList',
        name: 'MaoyanRankingListRatingList',
        component: () => import('@/views/crawling/MaoyanRankingListRatingList'),
        meta: { title: '评分排行榜', icon: 'iconfont icon-mail' }
      },
      {
        path: 'wantToSeeList',
        name: 'MaoyanRankingListWantToSeeList',
        component: () =>
          import('@/views/crawling/MaoyanRankingListWantToSeeList'),
        meta: { title: '想看排行榜', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/maoyanPreSaleList',
    component: Layout,
    redirect: '/maoyanPreSaleList/preSale',
    name: 'crawlingPreSale',
    meta: { title: '猫眼预售爬虫', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'preSale',
        name: 'preSale',
        component: () => import('@/views/crawling/MaoyanPreSale'),
        meta: { title: '预售爬虫', icon: 'iconfont icon-mail' }
      },
      {
        path: 'bookingDetails',
        name: 'preSaleBookingDetails',
        component: () => import('@/views/crawling/MaoyanPreSaleBookingDetails'),
        meta: { title: '预售首映日明细爬虫', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/maoyanOthersList',
    component: Layout,
    redirect: '/maoyanOthersList/boxOffice',
    name: 'othersList',
    meta: { title: '猫眼其他爬虫', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'boxOffice',
        name: 'boxOffice',
        component: () => import('@/views/crawling/Maoyan'),
        meta: { title: '猫眼实时票房爬虫', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/headers',
    name: 'settingsLayout',
    meta: { title: '设置', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'headers',
        name: 'headers',
        component: () => import('@/views/settings/Headers'),
        meta: { title: '请求头设置', icon: 'iconfont icon-mail' }
      },
      {
        path: '',
        name: 'settings',
        component: () => import('@/views/settings/Settings'),
        meta: { title: '参数设置', icon: 'iconfont icon-mail' }
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('@/views/settings/Dictionary'),
        meta: { title: '字典表设置', icon: 'iconfont icon-mail' }
      },
      {
        path: 'glyph-mapping',
        name: 'glyph-mapping',
        component: () => import('@/views/settings/GlyphMapping'),
        meta: { title: '字形映射', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    //   path: '/task',
    //   component: Layout,
    //   redirect: '/task/tryplay',
    //   name: 'task',
    //   meta: {
    //     title: '任务', icon: 'iconfont icon-mail'
    //   },
    //   children: [{
    //     path: 'demogame',
    //     name: 'demoGame',
    //     component: () => import('@/views/task/demoGame'),
    //     meta: { title: '下载试玩', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'bankcard',
    //     name: 'bankCard',
    //     component: () => import('@/views/task/BankCard'),
    //     meta: { title: '银行办卡', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'registermakemoney',
    //     name: 'registerMakeMoney',
    //     component: () => import('@/views/task/registerMakeMoney'),
    //     meta: { title: '注册赚钱', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'homepageguide',
    //     name: 'homepageGuide',
    //     component: () => import('@/views/task/homepageGuide'),
    //     meta: { title: '首页引导', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'registrationinvitation',
    //     name: 'registrationInvitation',
    //     component: () => import('@/views/task/registrationInvitation'),
    //     meta: { title: '注册邀请', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'blackcard',
    //     name: 'blackCard',
    //     component: () => import('@/views/task/BlackCard'),
    //     meta: { title: '黑卡', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/metadata',
    //   name: 'metadata',
    //   component: Layout,
    //   meta: { title: '元数据', icon: 'iconfont icon-mail' },
    //   redirect: {
    //     name: 'metaDataBuilding'
    //   },
    //   children: [{
    //     path: 'building',
    //     name: 'metaDataBuilding',
    //     component: () => import('@/views/metaData/metaDataBuilding'),
    //     meta: { title: '建筑元数据', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'feature',
    //     name: 'metaDataFeature',
    //     component: () => import('@/views/metaData/metaDataFeature'),
    //     meta: { title: 'Feature元数据', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/advertising',
    //   component: Layout,
    //   redirect: '/advertising/advertistingList',
    //   name: 'advertising',
    //   meta: {
    //     title: '广告',
    //     icon: 'iconfont icon-mail'
    //   },
    //   children: [{
    //     path: 'list',
    //     name: 'advertisingList',
    //     component: () => import('@/views/advertising/advertisingList'),
    //     meta: { title: '广告列表', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'popup',
    //     name: 'popupAdvertisingList',
    //     component: () => import('@/views/advertising/popupAdvertisingList'),
    //     meta: { title: '弹窗广告', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/notice',
    //   component: Layout,
    //   redirect: '/notice/list',
    //   name: 'notice',
    //   meta: {
    //     title: '公告',
    //     icon: 'iconfont icon-mail'
    //   },
    //   children: [{
    //     hidden: true,
    //     path: 'edit',
    //     name: 'noticeEdit',
    //     component: () => import('@/views/notice/noticeEdit'),
    //     meta: { title: '编辑公告', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'list',
    //     name: 'noticeList',
    //     component: () => import('@/views/notice/noticeList'),
    //     meta: { title: '公告列表', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/betterDiscount',
    //   component: Layout,
    //   name: 'betterDiscount',
    //   meta: { title: '好折扣', icon: 'iconfont icon-mail' },
    //   redirect: {
    //     name: 'metaDataBuilding'
    //   },
    //   children: [{
    //     path: 'categorylist',
    //     name: 'categoryList',
    //     component: () => import('@/views/betterDiscount/categoryList'),
    //     meta: { title: '分类列表', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'productList',
    //     name: 'productList',
    //     component: () => import('@/views/betterDiscount/productList'),
    //     meta: { title: '商品列表', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/bestv',
    //   component: Layout,
    //   name: 'BesTV',
    //   meta: { title: 'BesTV', icon: 'iconfont icon-mail' },
    //   redirect: {
    //     name: 'metaDataBuilding'
    //   },
    //   children: [{
    //     path: 'agent',
    //     name: 'agent',
    //     component: () => import('@/views/besTv/agent'),
    //     meta: { title: '代理商', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'cardnumber',
    //     name: 'cardNumber',
    //     component: () => import('@/views/besTv/cardNumber'),
    //     meta: { title: '自助生成卡号', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/game',
    //   component: Layout,
    //   name: 'game',
    //   meta: {
    //     title: '游戏',
    //     icon: 'iconfont icon-mail'
    //   },
    //   children: [{
    //     path: 'list',
    //     name: 'gameList',
    //     component: () => import('@/views/game/gameList'),
    //     meta: { title: '游戏列表', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'sort',
    //     name: 'gameSort',
    //     component: () => import('@/views/game/gameSort'),
    //     meta: { title: '游戏排序', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'type',
    //     name: 'gameType',
    //     component: () => import('@/views/game/gameType'),
    //     meta: { title: '游戏版块', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/edifice',
    //   component: Layout,
    //   name: 'edifice',
    //   meta: {
    //     title: '趣谷大厦',
    //     icon: 'iconfont icon-mail'
    //   },
    //   children: [{
    //     path: 'brand',
    //     name: 'brandManagement',
    //     component: () => import('@/views/edifice/brandManagement'),
    //     meta: { title: '品牌管理', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'management',
    //     name: 'edificeManagement',
    //     component: () => import('@/views/edifice/edificeManagement'),
    //     meta: { title: '楼层管理', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/wheel',
    //   component: Layout,
    //   name: 'wheel',
    //   meta: {
    //     title: '转盘抽奖',
    //     icon: 'iconfont icon-mail'
    //   },
    //   children: [{
    //     path: 'activity',
    //     name: 'wheelActivityManagement',
    //     component: () => import('@/views/wheel/WheelActivityManagement'),
    //     meta: { title: '活动属性', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'product',
    //     name: 'thirdPartyProductManagement',
    //     component: () => import('@/views/wheel/ThirdPartyProductManagement'),
    //     meta: { title: '第三方产品', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'prize',
    //     name: 'prizeManagement',
    //     component: () => import('@/views/wheel/PrizeManagement'),
    //     meta: { title: '奖品管理', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'wheel',
    //     name: 'wheelManagement',
    //     component: () => import('@/views/wheel/WheelManagement'),
    //     meta: { title: '转盘内容', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/message',
    //   component: Layout,
    //   name: 'message',
    //   meta: {
    //     title: '消息管理',
    //     icon: 'iconfont icon-mail'
    //   },
    //   children: [{
    //     path: 'sendmessage',
    //     name: 'sendMessage',
    //     component: () => import('@/views/message/SendMessage'),
    //     meta: { title: '发送消息', icon: 'iconfont icon-mail' }
    //   }]
    // }, {
    //   path: '/ecommerce',
    //   component: Layout,
    //   name: 'eCommerce',
    //   meta: {
    //     title: '电商管理',
    //     icon: 'iconfont icon-mail'
    //   },
    //   children: [{
    //     //   path: 'item',
    //     //   name: 'eCommerceItemManagement',
    //     //   component: () => import('@/views/eCommerce/ECommerceItemManagement'),
    //     //   meta: {title: 'Item管理', icon: 'iconfont icon-mail'}
    //     // },{
    //     path: 'sku',
    //     name: 'eCommerceSkuManagement',
    //     component: () => import('@/views/eCommerce/ECommerceSkuManagement'),
    //     meta: { title: 'SKU管理', icon: 'iconfont icon-mail' }
    //   }, {
    //     path: 'virtualassets',
    //     name: 'eCommerceVirtualAssetsManagement',
    //     component: () => import('@/views/eCommerce/ECommerceVirtualAssetsManagement'),
    //     meta: { title: '虚拟资产管理', icon: 'iconfont icon-mail' }
    //     // },{
    //     //   path: 'item',
    //     //   name: 'eCommerceItemManagement',
    //     //   component: () => import('@/views/message/ECommerceItemManagement'),
    //     //   meta: {title: '发送消息', icon: 'iconfont icon-mail'}
    //   }]
    // }, {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
