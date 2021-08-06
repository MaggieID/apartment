import request from '@/utils/request'

export function GetAllDicsByPId(data) {
    return request({
        url: '/Api/Xsgy/Dic/GetAllDicsByPId',
        method: 'post',
        data
    })
}

export function GetDics(data) {
    return request({
        url: '/Api/Xsgy/Dic/GetAllChildrenDicsByNumber',
        method: 'post',
        data
    })
}