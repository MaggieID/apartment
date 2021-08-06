import request from '@/utils/request'

// 换宿
export function HuanShu(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/HuanShu',
        method: 'post',
        data
    })
}

export function BatchHS(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/BatchHS',
        method: 'post',
        data
    })
}

// 互调
export function HuDiao(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/HuDiao',
        method: 'post',
        data
    })
}

// 入住
export function RuZhu(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/RuZhu',
        method: 'post',
        data
    })
}

// 退宿
export function TuiShu(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/TuiShu',
        method: 'post',
        data
    })
}

// 合同信息
export function GetContract(data) {
    return request({
        url: '/Api/Xsgy/Contract/GetContract',
        method: 'post',
        data
    })
}

// 批量入住
export function BatchRZ(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/BatchRZ',
        method: 'post',
        data
    })
}

// 批量退宿
export function BatchTS(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/BatchTS',
        method: 'post',
        data
    })
}

export function BatchTSByQueryCondition(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/BatchTSByQueryCondition',
        method: 'post',
        data
    })
}

// 批量操作进度
export function GetBatchProgressBar(data) {
    return request({
        url: '/Api/Xsgy/Batch/GetBatchProgressBar',
        method: 'post',
        data
    })
}

// 即时任务队列
export function QueryJobQueue(data) {
    return request({
        url: '/Api/Comm/Jobs/QueryJobQueue',
        method: 'post',
        data
    })
}

// 全部合同
export function GetContractLiveInfo(data) {
    return request({
        url: '/Api/Xsgy/Contract/GetContractLiveInfo',
        method: 'post',
        data
    })
}

// 导入入住
export function ExcelBatchRZ(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/ExcelBatchRZ',
        method: 'post',
        data
    })
}

// 自动匹配入住
export function AutomaticMatchingRZ(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/AutomaticMatchingRZ',
        method: 'post',
        data
    })
}

// 导入退宿
export function ExcelBatchTS(data) {
    return request({
        url: '/Api/Xsgy/LiveOperation/ExcelBatchTS',
        method: 'post',
        data
    })
}