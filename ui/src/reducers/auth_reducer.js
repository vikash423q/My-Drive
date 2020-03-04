import Cookies from 'js-cookie';

const initialState = {
    loggedIn: false, // make it false if not debugging Dashboard.
    darkMode: true,

}

const authReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case 'AUTHENTICATION':
            newState.loggedIn = action.payload;
            if (!action.payload) { Cookies.remove("auth") }
            return newState;

        case 'TOGGLE_MODE':
            newState.darkMode = action.payload;
            return newState;

        default:
            return state;
    }
}

export default authReducer;