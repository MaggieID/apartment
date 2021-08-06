import { login, getInfo } from '@/api/UserInfo'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'

const state = {
    token: getToken(),
    roles: [],
    userInfo: {},
    componentPower: [],
    layout: [],
    AppList: [],
    AppLayout: [],
    IdentityData: ['学生', '教职工', '家属', '其他人员'],
    ActionType: ['入住', '退宿', '换宿', '互调', '批量入住', '批量退宿', '寒暑假入住'],
    LiveType: ['一人一床', '多人一床'],
    roomColor: ['#81B2AE', '#E6A23E', '#EAF6FF', '#dfa2a2', '#dfa2d2', '#dfb6a2', '#82C588', '#EFEEC8', '#3C9681', '#a2aadf', '#a2c9df', '#a2dfa7', '#e8a367', '#7567e8', '#e8c067', '#12ab95', '#494c73', '#735349', '#30687d', '#4177e6', '#dfa2a2']
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    SET_COMPONENTPOWER: (state, componentPower) => {
        state.componentPower = componentPower
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password, loginType, type } = userInfo
        return new Promise((resolve, reject) => {
            login({ number: username.trim(), number2: password, loginType: loginType }).then(response => {
                if (response.BS == '1') {
                    const data = response.Data
                    commit('SET_TOKEN', data)
                    setToken(data)
                    resolve()
                } else {
                    Message.error(`${type[loginType].name}或${type[loginType].psw}错误,请重新输入!`)
                    reject()
                }
            }).catch(error => {
                Message.error(error)
                reject(error)
            })

            // resolve()
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo().then(response => {
                const data = response.Data
                if (!data) {
                    reject('验证失败，请重新登录.')
                }
                commit('SET_USERINFO', data)
                commit('SET_ROLES', data.ViewGroup.Menus)
                commit('SET_COMPONENTPOWER', data.ViewGroup)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '')
            commit('SET_USERINFO', {})
            removeToken()
            resetRouter()
            resolve()
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_USERINFO', {})
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    changeRoles({ commit, dispatch }, role) {
        return new Promise(async resolve => {
            const token = role + '-token'
            commit('SET_TOKEN', token)
            setToken(token)
            const { roles } = await dispatch('getInfo')
            console.log('roles' + roles)
            resetRouter()
            const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
            router.addRoutes(accessRoutes)
            dispatch('tagsView/delAllViews', null, { root: true })
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}