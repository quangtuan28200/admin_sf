export const authReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case "SET_AUTH":
            return {
                ...state,
                authLoading: false,
                ...payload,
            };
        case "UPDATE_STORE":
            return {
                ...state,
                ...payload,
            };
        case "UPDATE_AVATAR":
            return {
                ...state,
                avatar: payload,
            };

        default:
            return state;
    }
};
