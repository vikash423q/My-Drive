const initialState = {
    alloted: 0,
    used: 0,
    load: true
}

const storage_reducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case 'LOAD_STORAGE':
            newState.load = true;
            return newState;

        case 'STORAGE_UPDATED':
            newState.used = action.payload;
            newState.load = false;
            return newState;

        case 'CAPACITY_UPDATED':
            newState.alloted = action.payload;
            newState.load = false;
            return newState;

        default:
            return state;

    }
}

export default storage_reducer;
