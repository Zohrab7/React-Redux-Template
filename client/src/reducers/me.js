export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_ME':
            return action.me
        default:
            return state
    }
}
