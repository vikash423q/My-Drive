const initialState = {
    list: []

}

const starReducer = (state = initialState, action) => {
    var newState = { ...state };
    switch (action.type) {
        case 'STAR_UPDATED':
            newState.list = action.list;
            return newState;
        default:
            return state;
    }
}

export default starReducer;