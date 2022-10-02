export const foodsReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case "FOODS_LOADED_SUCCESS":
            return {
                ...state,
                foods: payload,
                foodsLoading: false,
            };

        case "FOODS_LOADED_FAIL":
            return {
                ...state,
                foods: [],
                foodsLoading: false,
            };

        case "ADD_FOOD":
            return {
                ...state,
                foods: [...state.foods, payload],
            };

        case "DELETE_FOOD":
            return {
                ...state,
                foods: state.foods.filter((food) => food._id !== payload),
            };

        // case FIND_POST:
        // 	return { ...state, post: payload }

        case "UPDATE_FOOD":
            const newFoods = state.foods.map((food) =>
                food._id === payload._id ? payload : food
            );

            return {
                ...state,
                foods: newFoods,
            };

        default:
            return state;
    }
};
