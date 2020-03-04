const initialState = {
    list: []

}

const recentReducer = (state = initialState, action) => {
    var newState = { ...state };
    switch (action.type) {
        case 'RECENT_UPDATED':
            newState.list = action.list;
            return newState;
        default:
            return state;
    }
}

export default recentReducer;