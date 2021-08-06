import { constantRoutes } from '@/router'
import Layout from '@/layout';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

export function RoutesChildren(roles, id) {
    const res = [];
    // console.log(roles)
    if (roles.length > 0) {
        for (let i = 0; i < roles.length; i++) {
            var tmp = {
                path: roles[i].CallAddr,
                component: (resolve) => require([`@/views${roles[i].Component}`], resolve),
                name: roles[i].RouteName,
                hidden: roles[i].IsHidden,
                meta: {
                    title: roles[i].MenuName,
                    icon: roles[i].Style,
                    affix: false
                },
                children: RoutesChildren(roles[i].Childs)
            }
            res.push(tmp)
        }
    }
    return res
}
export function filterAsyncRoutes(roles) {
    const res = [];
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].ParentId == null) {
            var tmp = {
                path: roles[i].CallAddr,
                component: Layout,
                // redirect: roles[i].redirectUrl,
                hidden: roles[i].IsHidden,
                meta: {
                    title: roles[i].MenuName,
                    icon: roles[i].Style,
                    affix: false
                },
                children: RoutesChildren(roles[i].Childs).length == 0 ? [{
                    path: roles[i].CallAddr,
                    component: (resolve) => require([`@/views${roles[i].Component}`], resolve),
                    name: roles[i].RouteName,
                    meta: { title: roles[i].MenuName, affix: false }
                }] : RoutesChildren(roles[i].Childs, roles[i])
            }
            res.push(tmp)
        }
    }
    return res
}

const state = {
    routes: constantRoutes,
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

// 生成路由
const actions = {
    generateRoutes({ commit }, userInfo) {
        return new Promise(resolve => {
            let accessedRoutes
            if (userInfo.ViewGroup && userInfo.ViewGroup.Menus.length > 0) {
                accessedRoutes = filterAsyncRoutes(JSON.parse(JSON.stringify(userInfo.ViewGroup.Menus)))
                    // console.log('powerjson', accessedRoutes)
            } else {
                accessedRoutes = []
            }
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}