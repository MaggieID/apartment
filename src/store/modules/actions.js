import { GetDics } from '@/api/Dic'
import { GetStractureSpecifiedTree } from '@/api/Construct'
import { GetCollegeTree, GetDepartmentTree } from '@/api/Permission'
import { GetLabels } from '@/api/Lable'
import { QueryJobQueue, GetBatchProgressBar } from '@/api/LiveOperation'
import { GetBatchList } from '@/api/GraduateBatch'
import { GetRoles } from '@/api/Role'

const state = {
    sexList: [],
    buildTree: [],
    departmentList: [],
    collegeList: [],
    labelList: [],
    JobList: [],
    CWYTList: [],
    FJYTList: [],
    backProgress: [],
    batchList: [],
    RoleList: []
}
const mutations = {
    SET_SEX: (state, data) => {
        state.sexList = data
    },
    SET_BUILDING: (state, data) => {
        state.buildTree = data
    },
    SET_DEPARTMENT: (state, data) => {
        state.departmentList = data
    },
    SET_COLLEGE: (state, data) => {
        state.collegeList = data
    },
    SET_LABELS: (state, data) => {
        state.labelList = data
    },
    SET_JobQueue: (state, data) => {
        state.JobList = data
    },
    SET_CWYT: (state, data) => {
        state.CWYTList = data
    },
    SET_FJYT: (state, data) => {
        state.FJYTList = data
    },
    SET_Progress: (state, data) => {
        state.backProgress = data
    },
    SET_BatchList: (state, data) => {
        state.batchList = data
    },
    SET_RoleList: (state, data) => {
        state.RoleList = data
    }
}
const actions = {
    GetRoles({ commit }, page) {
        return new Promise((resolve, reject) => {
            GetRoles({ page: page }).then(res => {
                if (res.BS == '1') {
                    commit('SET_RoleList', res.Data)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 批量操作
    GetBatchList({ commit }, page) {
        return new Promise((resolve, reject) => {
            GetBatchList({ page: page }).then(res => {
                if (res.BS == '1') {
                    commit('SET_BatchList', res.Data)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 任务队列
    QueryJobQueue({ commit }, JobName) {
        return new Promise((resolve, reject) => {
            QueryJobQueue({ jobName: JobName, page: null }).then(res => {
                if (res.BS == '1') {
                    commit('SET_JobQueue', res.Data)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    GetBatchProgressBar({ commit, dispatch }, jobKeys) {
        if (jobKeys.length == 0) {
            return
        }
        return new Promise((resolve, reject) => {
            GetBatchProgressBar({ jobKeys: jobKeys }).then(res => {
                if (res.BS == '1') {
                    commit('SET_Progress', res.Data)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 床位用途
    getCWYT({ commit }) {
        return new Promise((resolve, reject) => {
            GetDics({ number: 'CWYT' }).then(res => {
                if (res.BS == '1') {
                    commit('SET_CWYT', res.Data)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 房间用途
    getFJYT({ commit }) {
        return new Promise((resolve, reject) => {
            GetDics({ number: 'FJYT' }).then(res => {
                if (res.BS == '1') {
                    commit('SET_FJYT', res.Data)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 性别
    getSex({ commit }) {
        return new Promise((resolve, reject) => {
            GetDics({ number: 'Sex' }).then(res => {
                if (res.BS == '1') {
                    commit('SET_SEX', res.Data)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 楼栋
    GetBuilding({ commit }, StructureEnum) {
        return new Promise((resolve, reject) => {
            GetStractureSpecifiedTree({ StructureEnum: StructureEnum }).then(res => {
                if (res.BS == '1') {
                    commit('SET_BUILDING', res.Data.Childs)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 学院
    GetCollegeTree({ commit }) {
        return new Promise((resolve, reject) => {
            GetCollegeTree().then(res => {
                if (res.BS == '1') {
                    commit('SET_COLLEGE', res.Data.Childs)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 部门
    GetDepartmentTree({ commit }) {
        return new Promise((resolve, reject) => {
            GetDepartmentTree().then(res => {
                if (res.BS == '1') {
                    commit('SET_DEPARTMENT', res.Data.Childs)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 标签
    GetLabels({ commit }, LabelType) {
        return new Promise((resolve, reject) => {
            GetLabels({
                LabelType: LabelType,
                Page: null
            }).then(res => {
                if (res.BS == '1') {
                    commit('SET_LABELS', res.Data)
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}