const initialState = {
    list: []

}

const sharedReducer = (state = initialState, action) => {
    var newState = { ...state };
    switch (action.type) {
        case 'SHARED_UPDATED':
            newState.list = action.list;
            return newState;
        default:
            return state;
    }
}

export default sharedReducer;