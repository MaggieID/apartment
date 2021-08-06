import request from '@/utils/request'

// 删除楼栋组织
export function DeleteConstruct(data) {
    return request({
        url: '/Api/Xsgy/Construct/DeleteConstruct',
        method: 'post',
        data
    })
}

// 新增楼栋组织
export function AddConstruct(data) {
    return request({
        url: '/Api/Xsgy/Construct/AddConstruct',
        method: 'post',
        data
    })
}

// 查询 楼栋组织对象-按层级划分
export function GetConstructObject(data) {
    return request({
        url: '/Api/Xsgy/Construct/GetConstructObject',
        method: 'post',
        data
    })
}

// 修改楼栋组织
export function UpdateConstruct(data) {
    return request({
        url: '/Api/Xsgy/Construct/UpdateConstruct',
        method: 'post',
        data
    })
}

export function GetStructureByType(data) {
    return request({
        url: '/Api/Xsgy/Structure/GetStructureByType',
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

export function GetTemplateInfos(data) {
    return request({
        url: '/Api/Xsgy/Template/GetTemplateInfos',
        method: 'post',
        data
    })
}

// 查询 建筑结构父级
export function GetParentConstruct(data) {
    return request({
        url: '/Api/Xsgy/Construct/GetParentConstruct',
        method: 'post',
        data
    })
}

// 查询全部建筑结构组成树形
export function GetALLConstructTree(data) {
    return request({
        url: '/Api/Xsgy/Construct/GetALLConstructTree',
        method: 'post',
        data
    })
}

// 查询指定层级的树形
export function GetStractureSpecifiedTree(data) {
    return request({
        url: '/Api/Xsgy/Construct/GetStractureSpecifiedTree',
        method: 'post',
        data
    })
}

// /Api/Xsgy/Construct/GetBeds
export function GetBeds(data) {
    return request({
        url: '/Api/Xsgy/Construct/GetBeds',
        method: 'post',
        data
    })
}

// 查询床位上入住人员信息
export function GetBedUserInfos(data) {
    return request({
        url: '/Api/Xsgy/Construct/GetBedUserInfos',
        method: 'post',
        data
    })
}

// 修改床位用途
export function UpdateBedLivePurpose(data) {
    return request({
        url: '/Api/Xsgy/Construct/UpdateBedLivePurpose',
        method: 'post',
        data
    })
}

// 修改房间用途
export function UpdateRoomLivePurpose(data) {
    return request({
        url: '/Api/Xsgy/Construct/UpdateRoomLivePurpose',
        method: 'post',
        data
    })
}

// 锁定
export function UpdateBedIsLock(data) {
    return request({
        url: '/Api/Xsgy/Construct/UpdateBedIsLock',
        method: 'post',
        data
    })
}

// 房间容量类型
export function GetRoomCapacity(data) {
    return request({
        url: '/Api/Xsgy/Construct/GetRoomCapacity',
        method: 'post',
        data
    })
}

// 设置床位标签
export function UpdateBedLabels(data) {
    return request({
        url: '/Api/Xsgy/Construct/UpdateBedLabels',
        method: 'post',
        data
    })
}

// 生成门牌
export function GenerateQRCode(data) {
    return request({
        url: '/Api/Xsgy/Construct/GenerateQRCode',
        method: 'post',
        data
    })
}

// 查询门牌
export function GetRoomNumberPlate(data) {
    return request({
        url: '/Api/Xsgy/Construct/GetRoomNumberPlate',
        method: 'post',
        data
    })
}

// 设置宿舍长
export function SetDormitoryDirector(data) {
    return request({
        url: '/Api/Xsgy/Construct/SetDormitoryDirector',
        method: 'post',
        data
    })
}