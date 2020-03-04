const initialState = {
    selected: 'My Drive'
}

const viewReducer = (state = initialState, action) => {
    var newState = { ...state };
    switch (action.type) {
        case 'VIEW_SELECTED':
            newState.selected = action.payload;
            return newState;
        default:
            return state;
    }
}

export default viewReducer;