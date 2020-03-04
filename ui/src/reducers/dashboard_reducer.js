const initialState = {
    menu: false,
    detail: false,
    detailEntity: {}
}

const dashboardReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {

        case 'TOGGLE_MENU':
            newState.menu = !state.menu;
            return newState;

        case 'TOGGLE_DETAIL':
            newState.detail = !state.detail;
            return newState;

        case 'GET_DETAIL':
            newState.detail = true;
            newState.detailEntity = action.payload;
            return newState;

        default:
            return state;
    }
}

export default dashboardReducer;