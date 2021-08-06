import request from '@/utils/request'

// 查询房间信息
export function GetRoomLiveInfo(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/GetRoomLiveInfo',
        method: 'post',
        data
    })
}

// 住宿一览
export function GetLiveInfoViewList(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/GetLiveInfoViewList',
        method: 'post',
        data
    })
}

// 查询床位操作历史信息
export function GetBedUserChangerHistroy(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/GetBedUserChangeHistory',
        method: 'post',
        data
    })
}

// 导出excel入住模板（人员）
export function ExcelUserInfo(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/ExcelUserInfo',
        method: 'post',
        responseType: 'blob',
        data
    })
}

// 导出excel入住模板（楼栋）
export function ExcelConstructInfo(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/ExcelConstructInfo',
        method: 'post',
        responseType: 'blob',
        data
    })
}

// 分析Excel
export function AnalyzeExcel(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/AnalyzeExcel',
        method: 'post',
        data
    })
}

// 查询批量导入入住临时表
export function GetExcelBatchRZ(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/GetExcelBatchRZTemporaryTable',
        method: 'post',
        data
    })
}

// 导入批量入住
export function ImportBatchAddLiveExcel(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/ImportBatchAddLiveExcel',
        method: 'post',
        data
    })
}

// 入住修改
export function BatchSetRZTemporaryTable(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/BatchSetExcelBatchRZTemporaryTable',
        method: 'post',
        data
    })
}

// 查入住详情
export function GetRZAnalyseResultInfo(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/GetExcelBatchRZAnalyseResultInfo',
        method: 'post',
        data
    })
}

// 入住删除
export function DeleteExcelBatchRZRedis(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/DeleteExcelBatchRZRedis',
        method: 'post',
        data
    })
}

// 自动匹配入住详情
export function GetAutomaticInfo(data) {
    return request({
        url: '/Api/Xsgy/Batch/GetAutomaticMatchingJobResultInfo',
        method: 'post',
        data
    })
}

// 导出excel退宿模板（楼栋）
export function ExcelTSContractLDInfo(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/ExcelTSContractLDInfo',
        method: 'post',
        responseType: 'blob',
        data
    })
}

// 导出excel退宿模板（人员）
export function ExcelTSContractRYInfo(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/ExcelTSContractRYInfo',
        method: 'post',
        responseType: 'blob',
        data
    })
}

// 自动匹配导入人员
export function ExcelUserInfoTemplate(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/ExcelUserInfoTemplate',
        method: 'post',
        responseType: 'blob',
        data
    })
}

// 查询excel退宿
export function GetExcelBatchTS(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/GetExcelBatchTSTemporaryTable',
        method: 'post',
        data
    })
}

// 删除excel退宿
export function DeleteExcelBatchTSRedis(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/DeleteExcelBatchTSRedis',
        method: 'post',
        data
    })
}

// 查询详情
export function GetTSAnalyseResultInfo(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/GetExcelBatchTSAnalyseResultInfo',
        method: 'post',
        data
    })
}

// 修改退宿
export function BatchSetExcelBatchTS(data) {
    return request({
        url: '/Api/Xsgy/LiveInfo/BatchSetExcelBatchTSTemporaryTable',
        method: 'post',
        data
    })
}