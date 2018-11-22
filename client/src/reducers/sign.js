export default (state = {}, action) => {
    switch (action.type) {
        case 'HANDLE_SIGN_FIELD_CHANGE':
            return {
                ...state,
                [action.name]: action.value
            }
        default:
            return state
    }
}
