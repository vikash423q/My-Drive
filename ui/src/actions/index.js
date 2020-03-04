export const login_toggle = (payload) => ({
    type: 'AUTHENTICATED',
    payload: payload
});


export const darkmode_toggle = (payload) => ({
    type: 'TOGGLE_MODE',
    payload: payload
})