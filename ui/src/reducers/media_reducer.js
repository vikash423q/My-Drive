const initialState = {
    file: {},
    open: false,
    loaded: false,
    link: null
}

const mediaReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case 'OPEN_MEDIA':
            newState.file = action.item;
            newState.open = true;
            return newState;

        case 'CLOSE_MEDIA':
            newState.open = false;
            newState.loaded = false;
            return newState;

        case 'MEDIA_LOADED':
            newState.loaded = action.payload;
            newState.link = action.link;
            return newState;

        default:
            return state;
    }
}

export default mediaReducer;