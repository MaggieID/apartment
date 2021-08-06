import request from '@/utils/request'

/** **********************************权限组***************************** */

export function AddViewGroup(data) {
    return request({
        url: '/Api/Xsgy/Permission/AddViewGroup',
        method: 'post',
        data
    })
}

export function QueryViewGroup(data) {
    return request({
        url: '/Api/Xsgy/Permission/QueryViewGroup',
        method: 'post',
        data
    })
}

export function UpdateViewGroup(data) {
    return request({
        url: '/Api/Xsgy/Permission/UpdateViewGroup',
        method: 'post',
        data
    })
}

export function GetMenuInfos(data) {
    return request({
        url: '/Api/Xsgy/Menu/GetEnableMenuInfos',
        method: 'post',
        data
    })
}

// 学院树
export function GetCollegeTree(data) {
    return request({
        url: '/Api/Xsgy/College/GetCollegeTree',
        method: 'post',
        data
    })
}

// 部门树
export function GetDepartmentTree(data) {
    return request({
        url: '/Api/Xsgy/Department/GetDepartmentTree',
        method: 'post',
        data
    })
}

/** **********************************数据权限***************************** */

export function AddURC(data) {
    return request({
        url: '/Api/Xsgy/Permission/AddURC',
        method: 'post',
        data
    })
}

export function AddURD(data) {
    return request({
        url: '/Api/Xsgy/Permission/AddURD',
        method: 'post',
        data
    })
}

export function AddURS(data) {
    return request({
        url: '/Api/Xsgy/Permission/AddURS',
        method: 'post',
        data
    })
}

export function DelURC(data) {
    return request({
        url: '/Api/Xsgy/Permission/DelURC',
        method: 'post',
        data
    })
}

export function DelURD(data) {
    return request({
        url: '/Api/Xsgy/Permission/DelURD',
        method: 'post',
        data
    })
}

export function DelURS(data) {
    return request({
        url: '/Api/Xsgy/Permission/DelURS',
        method: 'post',
        data
    })
}

export function QueryURC(data) {
    return request({
        url: '/Api/Xsgy/Permission/QueryURC',
        method: 'post',
        data
    })
}

export function QueryURD(data) {
    return request({
        url: '/Api/Xsgy/Permission/QueryURD',
        method: 'post',
        data
    })
}

export function QueryURS(data) {
    return request({
        url: '/Api/Xsgy/Permission/QueryURS',
        method: 'post',
        data
    })
}

export function QueryViewGroupUserInfos(data) {
    return request({
        url: '/Api/Xsgy/Permission/QueryViewGroupUserInfos',
        method: 'post',
        data
    })
}

export function UpdateViewGroupUser(data) {
    return request({
        url: '/Api/Xsgy/Permission/UpdateViewGroupUser',
        method: 'post',
        data
    })
}

export function DelViewGroupUser(data) {
    return request({
        url: '/Api/Xsgy/Permission/DelViewGroupUser',
        method: 'post',
        data
    })
}