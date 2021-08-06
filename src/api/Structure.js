import request from '@/utils/request'

export function GetStructureByType(data) {
    return request({
        url: '/Api/Xsgy/Structure/GetStructureByType',
        method: 'post',
        data
    })
}