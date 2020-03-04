const initialState = {
    list: []

}

const binReducer = (state = initialState, action) => {
    var newState = { ...state };
    switch (action.type) {
        case 'BIN_UPDATED':
            newState.list = action.list;
            return newState;
        default:
            return state;
    }
}

export default binReducer;