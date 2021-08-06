const getters = {
    /** ****************************actions************************************ */
    sexList: state => state.actions.sexList, // 性别
    buildTree: state => state.actions.buildTree, // 楼栋
    departmentList: state => state.actions.departmentList, // 部门
    collegeList: state => state.actions.collegeList, // 学院
    labelList: state => state.actions.labelList, // 标签
    CWYTList: state => state.actions.CWYTList, // 床位用途
    FJYTList: state => state.actions.FJYTList, // 房间用途
    JobList: state => state.actions.JobList, // 队列
    backProgress: state => state.actions.backProgress, // 进度
    batchList: state => state.actions.batchList, // 批次
    RoleList: state => state.actions.RoleList, // 角色

    /** ***************************app************************************* */
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,

    /** *****************************tagsView*********************************** */
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,

    /** *****************************user*********************************** */
    userInfo: state => state.user.userInfo, // 用户信息
    token: state => state.user.token,
    ActionType: state => state.user.ActionType,
    IdentityData: state => state.user.IdentityData,
    LiveType: state => state.user.LiveType,
    roomColor: state => state.user.roomColor,
    roles: state => state.user.roles,

    /** ****************************permission************************************ */
    permission_routes: state => state.permission.routes
}
export default getters