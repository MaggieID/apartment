import request from '@/utils/request'

export function AddTemplate(data) {
    return request({
        url: '/Api/Xsgy/Template/AddTemplate',
        method: 'post',
        data
    })
}

export function AddTemplateCols(data) {
    return request({
        url: '/Api/Xsgy/Template/AddTemplateCols',
        method: 'post',
        data
    })
}

export function DelTemplateCols(data) {
    return request({
        url: '/Api/Xsgy/Template/DelTemplateCols',
        method: 'post',
        data
    })
}

export function GetTemplateControls(data) {
    return request({
        url: '/Api/Xsgy/Template/GetTemplateControls',
        method: 'post',
        data
    })
}

export function GetTemplateInfo(data) {
    return request({
        url: '/Api/Xsgy/Template/GetTemplateInfo',
        method: 'post',
        data
    })
}

export function UpdateTemplate(data) {
    return request({
        url: '/Api/Xsgy/Template/UpdateTemplate',
        method: 'post',
        data
    })
}