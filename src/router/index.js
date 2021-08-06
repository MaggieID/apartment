import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// const iframeRoutes = [{
//         path: '/accommodation',
//         component: Layout,
//         name: 'accommodation',
//         meta: {
//             title: '住宿管理',
//             icon: 'el-icon-platform-eleme',
//             affix: false
//         },
//         children: [{
//                 path: 'accommodationList',
//                 component: () =>
//                     import ('@/views/accommodation/accommodationList'),
//                 name: 'accommodationList',
//                 meta: {
//                     title: '住宿一览',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'housingView',
//                 component: () =>
//                     import ('@/views/accommodation/housingView/bb'),
//                 name: 'housingView',
//                 meta: {
//                     title: '房源图形绘制',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'arrangecheckIn',
//                 component: () =>
//                     import ('@/views/checkIn/sporadic'),
//                 name: 'arrangecheckIn',
//                 hidden: true,
//                 meta: {
//                     title: '安排入住',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'arrangecheckOut',
//                 component: () =>
//                     import ('@/views/checkOut/sporadic'),
//                 name: 'arrangecheckOut',
//                 hidden: true,
//                 meta: {
//                     title: '安排退宿',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'arrangechangePlan',
//                 component: () =>
//                     import ('@/views/changeDorm/changePlan'),
//                 name: 'arrangechangePlan',
//                 hidden: true,
//                 meta: {
//                     title: '安排换宿',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'arrangeExchange',
//                 component: () =>
//                     import ('@/views/changeDorm/exchangePlan'),
//                 name: 'arrangeExchange',
//                 hidden: true,
//                 meta: {
//                     title: '安排互调',
//                     affix: false
//                 }
//             }
//         ]
//     },
//     {
//         path: '/userManagement',
//         component: Layout,
//         name: 'userManagement',
//         meta: {
//             title: '人员管理',
//             icon: 'el-icon-platform-eleme',
//             affix: false
//         },
//         children: [{
//                 path: 'student',
//                 component: () =>
//                     import ('@/views/userManagement/student'),
//                 name: 'student',
//                 meta: {
//                     title: '学生管理',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'teacher',
//                 component: () =>
//                     import ('@/views/userManagement/teacher'),
//                 name: 'teacher',
//                 meta: {
//                     title: '教职工管理',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'family',
//                 component: () =>
//                     import ('@/views/userManagement/family'),
//                 name: 'family',
//                 meta: {
//                     title: '家属管理',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'others',
//                 component: () =>
//                     import ('@/views/userManagement/others'),
//                 name: 'others',
//                 meta: {
//                     title: '其他人员管理',
//                     affix: false
//                 }
//             }
//         ]
//     },
//     {
//         path: '/authorization',
//         component: Layout,
//         name: 'authorization',
//         meta: {
//             title: '权限管理',
//             icon: 'el-icon-platform-eleme',
//             affix: false
//         },
//         children: [{
//                 path: 'dataPermission',
//                 component: () =>
//                     import ('@/views/authorization/dataPermission'),
//                 name: 'dataPermission',
//                 meta: {
//                     title: '数据权限',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'pagePermission',
//                 component: () =>
//                     import ('@/views/authorization/pagePermission'),
//                 name: 'pagePermission',
//                 meta: {
//                     title: '页面权限',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'rolesManagement',
//                 component: () =>
//                     import ('@/views/authorization/rolesManagement'),
//                 name: 'rolesManagement',
//                 meta: {
//                     title: '角色管理',
//                     affix: false
//                 }
//             }
//         ]
//     },
//     {
//         path: '/systemSetting',
//         component: Layout,
//         name: 'systemSetting',
//         meta: {
//             title: '系统设置',
//             icon: 'el-icon-platform-eleme',
//             affix: false
//         },
//         children: [{
//                 path: 'constructSetting',
//                 component: () =>
//                     import ('@/views/systemSetting/constructSetting'),
//                 name: 'constructSetting',
//                 meta: {
//                     title: '楼栋组织配置',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'tagSetting',
//                 component: () =>
//                     import ('@/views/systemSetting/tagSetting'),
//                 name: 'tagSetting',
//                 meta: {
//                     title: '标签管理',
//                     affix: false
//                 }
//             }
//         ]
//     },
//     {
//         path: '/changeDorm',
//         component: Layout,
//         name: 'changeDorm',
//         meta: {
//             title: '调宿管理',
//             icon: 'el-icon-platform-eleme',
//             affix: false
//         },
//         children: [{
//                 path: 'changePlan',
//                 component: () =>
//                     import ('@/views/changeDorm/changePlan'),
//                 name: 'changePlan',
//                 meta: {
//                     title: '换宿安排管理',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'exchangePlan',
//                 component: () =>
//                     import ('@/views/changeDorm/exchangePlan'),
//                 name: 'exchangePlan',
//                 meta: {
//                     title: '互调安排管理',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'viewMode',
//                 component: () =>
//                     import ('@/views/changeDorm/viewMode'),
//                 name: 'viewMode',
//                 meta: {
//                     title: '视图模式调宿',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'batchChange',
//                 component: () =>
//                     import ('@/views/changeDorm/batchChange'),
//                 name: 'batchChange',
//                 meta: {
//                     title: '批量换宿管理',
//                     affix: false
//                 }
//             }
//         ]
//     },
//     {
//         path: '/checkIn',
//         component: Layout,
//         name: 'checkIn',
//         meta: {
//             title: '入住管理',
//             icon: 'el-icon-platform-eleme',
//             affix: false
//         },
//         children: [{
//                 path: 'automatic',
//                 component: () =>
//                     import ('@/views/checkIn/automatic'),
//                 name: 'checkInautomatic',
//                 meta: {
//                     title: '自动匹配入住',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'excelImport',
//                 component: () =>
//                     import ('@/views/checkIn/excelImport'),
//                 name: 'checkInexcelImport',
//                 meta: {
//                     title: 'Excel导入入住',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'manual',
//                 component: () =>
//                     import ('@/views/checkIn/manual'),
//                 name: 'checkInmanual',
//                 meta: {
//                     title: '手动安排入住',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'sporadic',
//                 component: () =>
//                     import ('@/views/checkIn/sporadic'),
//                 name: 'checkInsporadic',
//                 meta: {
//                     title: '零星入住管理',
//                     affix: false
//                 }
//             }
//         ]
//     },
//     {
//         path: '/checkOut',
//         component: Layout,
//         name: 'checkOut',
//         meta: {
//             title: '退宿管理',
//             icon: 'el-icon-platform-eleme',
//             affix: false
//         },
//         children: [{
//                 path: 'excelImport',
//                 component: () =>
//                     import ('@/views/checkOut/excelImport'),
//                 name: 'checkOutexcelImport',
//                 meta: {
//                     title: 'excel导入退宿',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'expire',
//                 component: () =>
//                     import ('@/views/checkOut/expire'),
//                 name: 'checkOutexpire',
//                 meta: {
//                     title: '到期通知退宿',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'graduation',
//                 component: () =>
//                     import ('@/views/checkOut/graduation'),
//                 name: 'checkOutgraduation',
//                 meta: {
//                     title: '毕业退宿管理',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'manual',
//                 component: () =>
//                     import ('@/views/checkOut/manual'),
//                 name: 'checkOutmanual',
//                 meta: {
//                     title: '手动安排退宿',
//                     affix: false
//                 }
//             },
//             {
//                 path: 'sporadic',
//                 component: () =>
//                     import ('@/views/checkOut/sporadic'),
//                 name: 'checkOutsporadic',
//                 meta: {
//                     title: '零星退宿管理',
//                     affix: false
//                 }
//             }
//         ]
//     }
// ]

export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () =>
                import ('@/views/redirect/index')
        }]
    },
    {
        path: '/',
        component: Layout,
        redirect: 'dashboard',
        hidden: true,
        children: [{
                path: 'dashboard',
                component: () =>
                    import ('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: { title: '首页', icon: 'dashboard', affix: true }
            },
            {
                path: '/overallPlan/:id',
                component: () =>
                    import ('@/views/newStudentInto/overallPlan'),
                name: 'overallPlan',
                meta: { title: '统筹方案' }
            }
        ]
    }
]

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router