const initialState = {
    currentFolder: '\\',
    list: []

}

const mydriveReducer = (state = initialState, action) => {
    var newState = { ...state };
    switch (action.type) {
        case 'FOLDER_CHANGED':
            newState.currentFolder = action.folder;
            newState.list = action.list;
            return newState;
        default:
            return state;
    }
}

export default mydriveReducer;