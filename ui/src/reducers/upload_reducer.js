import uploadManager from '../service/upload';

const initialState = {
    files: [],
    selected: {},
    show: true,
}

const uploadReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case 'FILES_QUEUED':
            console.log('uploadReducer files queued called', uploadManager.queue);
            newState.files = Array.from(uploadManager.queue);
            newState.show = true;
            return newState;

        case 'STATUS_CHANGED':
            console.log('uploadReducer status change called', uploadManager.queue);
            newState.files = Array.from(uploadManager.queue);
            newState.selected = action.selected || state.selected;
            newState.show = true;
            return newState;

        case 'TOGGLE_VIEW':
            newState.show = action.payload || !state.show;
            return newState;

        case 'UPDATE_SELECTED':
            newState.selected = action.payload;
            return newState;

        default:
            return state;
    }
}

export default uploadReducer;