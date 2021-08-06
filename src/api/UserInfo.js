import request from '@/utils/request'

/** ********************************** 登录********************************* */

export function login(data) {
    return request({
        url: '/Api/Comm/Login/Login',
        method: 'post',
        data
    })
}

export function getInfo(data) {
    return request({
        url: '/Api/Comm/Login/GetLoginUserInfo',
        method: 'post',
        data
    })
}

// 文件上传
export function UploadPhotoFile(data) {
    return request({
        url: '/Api/Comm/File/UploadPhotoFile',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

/** ********************************** 学生 ********************************* */

// 注册学生
export function RegisterStudent(data) {
    return request({
        url: '/Api/Xsgy/User/RegisterStudent',
        method: 'post',
        data
    })
}

// 更新学生信息
export function UpdateStudentInfo(data) {
    return request({
        url: '/Api/Xsgy/User/UpdateStudentInfo',
        method: 'post',
        data
    })
}

// 查询学生
export function QueryStudents(data) {
    return request({
        url: '/Api/Xsgy/User/QueryStudents',
        method: 'post',
        data
    })
}

export function QueryStudentList(data) {
    return request({
        url: '/Api/Xsgy/User/QueryStudentList',
        method: 'post',
        data
    })
}

// 删除学生
export function DelStudent(data) {
    return request({
        url: '/Api/Xsgy/User/DelStudent',
        method: 'post',
        data
    })
}

/** ********************************** 教师 ********************************* */

// 注册教师
export function RegisterTeacher(data) {
    return request({
        url: '/Api/Xsgy/User/RegisterTeacher',
        method: 'post',
        data
    })
}

// 更新教师信息
export function UpdateTeacherInfo(data) {
    return request({
        url: '/Api/Xsgy/User/UpdateTeacherInfo',
        method: 'post',
        data
    })
}

// 查询教师
export function QueryTeacher(data) {
    return request({
        url: '/Api/Xsgy/User/QueryTeacher',
        method: 'post',
        data
    })
}

// 删除教师
export function DelTeacher(data) {
    return request({
        url: '/Api/Xsgy/User/DelTeacher',
        method: 'post',
        data
    })
}

/** ****************************************************************************************************/
// 查询用户部门和学院信息
export function QueryUserDepAnColl(data) {
    return request({
        url: '/Api/Xsgy/User/QueryUserDepAnColl',
        method: 'post',
        data
    })
}

// 获取用户紧急联系人
export function QueryUserEmergencyContact(data) {
    return request({
        url: '/Api/Xsgy/User/QueryUserEmergencyContact',
        method: 'post',
        data
    })
}

// 通用人员信息查询
export function QueryUserList(data) {
    return request({
        url: '/Api/Xsgy/User/QueryUserList',
        method: 'post',
        data
    })
}

// 查询用户住宿历史信息
export function QueryUserLiveHisInfo(data) {
    return request({
        url: '/Api/Xsgy/User/QueryUserLiveHisInfo',
        method: 'post',
        data
    })
}

// 查询用户住宿信息
export function QueryUserLiveInfo(data) {
    return request({
        url: '/Api/Xsgy/User/QueryUserLiveInfo',
        method: 'post',
        data
    })
}

// 查询用户所拥有的角色信息
export function QueryUserOwnRoleInfo(data) {
    return request({
        url: '/Api/Xsgy/User/QueryUserOwnRoleInfo',
        method: 'post',
        data
    })
}

// 获取用户扩展信息
export function QueryUserProExtInfo(data) {
    return request({
        url: '/Api/Xsgy/User/QueryUserProExtInfo',
        method: 'post',
        data
    })
}

export function QueryUserDetails(data) {
    return request({
        url: '/Api/Xsgy/User/QueryUserDetails',
        method: 'post',
        data
    })
}

/** **************************************家属****************************************** */

export function QueryRelations(data) {
    return request({
        url: '/Api/Xsgy/User/QueryFamilyMembers',
        method: 'post',
        data
    })
}
export function DelRelation(data) {
    return request({
        url: '/Api/Xsgy/User/DelFamilyMember',
        method: 'post',
        data
    })
}
export function RegisterRelation(data) {
    return request({
        url: '/Api/Xsgy/User/RegisterFamilyMember',
        method: 'post',
        data
    })
}
export function UpdateRelationInfo(data) {
    return request({
        url: '/Api/Xsgy/User/UpdateFamilyMemberInfo',
        method: 'post',
        data
    })
}

/** **************************************其他人员****************************************** */

export function QueryOtherStaffs(data) {
    return request({
        url: '/Api/Xsgy/User/QueryOtherStaffs',
        method: 'post',
        data
    })
}
export function DelOtherStaffs(data) {
    return request({
        url: '/Api/Xsgy/User/DelOtherStaffs',
        method: 'post',
        data
    })
}
export function RegisterOtherStaffs(data) {
    return request({
        url: '/Api/Xsgy/User/RegisterOtherStaffs',
        method: 'post',
        data
    })
}
export function UpdateOtherStaffsInfo(data) {
    return request({
        url: '/Api/Xsgy/User/UpdateOtherStaffsInfo',
        method: 'post',
        data
    })
}