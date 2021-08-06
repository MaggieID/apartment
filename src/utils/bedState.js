export function getState(bed, showState, attribute) {
    var show = true
    if (attribute == 0) {
        if (showState != '') {
            var state = JSON.parse(showState)
            show = bed[state.field] == state.value
        } else {
            show = true
        }
    }
    return show
}
export function getRoom(room, showState, attribute) {
    var show = true
    if (attribute == 1) {
        if (showState != '') {
            var state = JSON.parse(showState)
            show = room[state.field] == state.value
        } else {
            show = true
        }
    }
    return show
}
export function getRoomName(room, showState, attribute) {
    var show = []
    if (attribute == 2) {
        if (showState != '') {
            var state = JSON.parse(showState)
            for (let i = 0; i < room[state.field].length; i++) {
                if (room[state.field][i].RoleId == state.value) {
                    show.push(room[state.field][i])
                }
            }
        } else {
            show = []
        }
    }
    return show
}
export function notdisabled(bed, isUser) {
    var state = true
    switch (isUser) {
        case '0':
            {
                state = bed.UserLiveInfos.length == 0 || bed.BedLiveType == '多人一床'
                break
            }
        case '1':
            {
                state = bed.UserLiveInfos.length > 0
                break
            }
        case '2':
            {
                state = true
                break
            }
        default:
            {
                state = true
                break
            }
    }
    var BedLivePurpose = !(bed.BedLivePurpose == '3' || bed.BedLivePurpose == '4' || bed.BedLivePurpose == '6')
    var backState = bed.IsLock == 0 && state && BedLivePurpose
    return backState
}