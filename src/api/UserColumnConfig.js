import request from '@/utils/request'

export function GetAppColumns(data) {
    return request({
        url: '/Api/Xsgy/UserColumnConfig/GetAppColumns',
        method: 'post',
        data
    })
}

export function GetUserAppColumns(data) {
    return request({
        url: '/Api/Xsgy/UserColumnConfig/GetUserAppColumns',
        method: 'post',
        data
    })
}

export function SaveAppColumns(data) {
    return request({
        url: '/Api/Xsgy/UserColumnConfig/SaveAppColumns',
        method: 'post',
        data
    })
}