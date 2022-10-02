import axios from "axios";
import React, { createContext, useReducer } from "react";
import { foodsReducer } from "../reducers/foodsReducer";
import { apiUrl } from "./constants";

export const FoodsContext = createContext();

const FoodsContextProvider = ({ children }) => {
    const [foodsState, dispatch] = useReducer(foodsReducer, {
        foods: [],
        foodsLoading: true,
    });

    const addFood = async (food) => {
        try {
            const response = await axios.post(`${apiUrl}/foods/add`, food);
            if (response.data.success) {
                dispatch({ type: "ADD_FOOD", payload: response.data.food });
                return response.data;
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: "Server error" };
        }
    };

    // Get all posts
    const getFoods = () => {
        axios
            .get(`${apiUrl}/foods`)
            .then((response) => {
                if (response.data.success) {
                    dispatch({
                        type: "FOODS_LOADED_SUCCESS",
                        payload: response.data.foods,
                    });
                }
            })
            .catch((error) => dispatch({ type: "FOODS_LOADED_FAIL" }));
    };

    // Delete post
    const deleteFood = (foodId) => {
        axios
            .delete(`${apiUrl}/foods/delete/${foodId}`)
            .then((response) => {
                if (response.data.success)
                    dispatch({ type: "DELETE_FOOD", payload: foodId });
            })
            .catch((error) => console.log(error));
    };

    // Update post
    const updateFood = async (food) => {
        try {
            const response = await axios.put(
                `${apiUrl}/foods/update/${food._id}`,
                food
            );
            if (response.data.success) {
                dispatch({ type: "UPDATE_FOOD", payload: response.data.food });
                return response.data;
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: "Server error" };
        }
    };

    // Context data
    const FoodsContextData = {
        addFood,
        getFoods,
        deleteFood,
        updateFood,
        foodsState,
    };

    // Return provider
    return (
        <FoodsContext.Provider value={FoodsContextData}>
            {children}
        </FoodsContext.Provider>
    );
};

export default FoodsContextProvider;
