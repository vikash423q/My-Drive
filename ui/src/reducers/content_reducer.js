const initialState = {
    type: 'My Drive',
    loading: false,
    loaded: false, // for the app to load, just first time.
    data: { list: [], folder: '/', shared: false },
    gridView: true
}

const contentReducer = (state = initialState, action) => {
    var newState = { ...state };
    switch (action.type) {
        case 'LOADING':
            newState.loading = action.loading;
            return newState;
        case 'CONTENT_UPDATED':
            newState.type = action.type || state.type;
            newState.loading = action.loading;
            newState.loaded = action.loaded || state.loaded;
            newState.data.list = action.list;
            newState.data.folder = action.folder;
            newState.data.shared = action.shared || false;
            return newState;

        case 'VIEW_CHANGED':
            newState.gridView = !state.gridView;
            return newState;
        default:
            return state;
    }
}

export default contentReducer;