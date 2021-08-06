import request from '@/utils/request'

export function AddLabel(data) {
    return request({
        url: '/Api/Xsgy/Label/AddLabel',
        method: 'post',
        data
    })
}

export function DeleteLable(data) {
    return request({
        url: '/Api/Xsgy/Label/DeleteLable',
        method: 'post',
        data
    })
}

export function GetLabels(data) {
    return request({
        url: '/Api/Xsgy/Label/GetLabels',
        method: 'post',
        data
    })
}

export function UpdateLabel(data) {
    return request({
        url: '/Api/Xsgy/Label/UpdateLabel',
        method: 'post',
        data
    })
}