import request from '@/utils/request'

export function DelRole(data) {
    return request({
        url: '/Api/Xsgy/Role/DelRole',
        method: 'post',
        data
    })
}

export function EditRole(data) {
    return request({
        url: '/Api/Xsgy/Role/EditRole',
        method: 'post',
        data
    })
}

export function GetRoles(data) {
    return request({
        url: '/Api/Xsgy/Role/GetRoles',
        method: 'post',
        data
    })
}