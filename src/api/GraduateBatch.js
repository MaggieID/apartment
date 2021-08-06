import request from '@/utils/request'

// 新增批次
export function AddGraduateBatch(data) {
    return request({
        url: '/Api/Xsgy/GraduateBatch/AddGraduateBatch',
        method: 'post',
        data
    })
}

// 删除批次
export function DelGraduateBatch(data) {
    return request({
        url: '/Api/Xsgy/GraduateBatch/DelGraduateBatch',
        method: 'post',
        data
    })
}

// 批次列表
export function GetBatchList(data) {
    return request({
        url: '/Api/Xsgy/GraduateBatch/GetBatchList',
        method: 'post',
        data
    })
}

// 批次学生
export function GetBatchStudentList(data) {
    return request({
        url: '/Api/Xsgy/GraduateBatch/GetBatchStudentList',
        method: 'post',
        data
    })
}

// 修改批次
export function UpdateGraduateBatch(data) {
    return request({
        url: '/Api/Xsgy/GraduateBatch/UpdateGraduateBatch',
        method: 'post',
        data
    })
}

// 从批次删除毕业生
export function DelGraduateBatchStudent(data) {
    return request({
        url: '/Api/Xsgy/GraduateBatch/DelGraduateBatchStudent',
        method: 'post',
        data
    })
}

// 添加毕业生
export function AddGraduateBatchStudent(data) {
    return request({
        url: '/Api/Xsgy/GraduateBatch/AddGraduateBatchStudent',
        method: 'post',
        data
    })
}