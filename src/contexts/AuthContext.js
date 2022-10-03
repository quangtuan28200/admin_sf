import { message } from "antd";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { collection, onSnapshot } from "firebase/firestore";
import React, { createContext, useEffect, useReducer } from "react";
// import { db } from "../ConfigDB/firebase";
import { authReducer } from "../reducers/authReducer";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    // const navigate = useNavigate();

    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        salon: null,
    });

    useEffect(() => {
        loadSalon();
    }, []);

    // Get store
    const loadSalon = () => {
        // onAuthStateChanged(getAuth(), (salon) => {
        //     if (salon) {
        //         onSnapshot(collection(db, "salons"), (snapshot) => {
        //             snapshot.docs.map((salon) => {
        //                 if (salon.data().id === getAuth().currentUser.uid) {
        //                     dispatch({
        //                         type: "SET_AUTH",
        //                         payload: {
        //                             salon: salon.data(),
        //                         },
        //                     });
        //                 }
        //             });
        //         });
        //     }
        // });
    };

    // Login store
    const loginSalon = (loginForm) => {
        signInWithEmailAndPassword(
            getAuth(),
            loginForm.email,
            loginForm.password
        )
            .then(() => {
                loadSalon();
                // navigate("/dashboard");
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

    // Logout
    const logoutSalon = () => {
        signOut(getAuth())
            .then(() => {
                dispatch({
                    type: "SET_AUTH",
                    payload: { isAuthenticated: false, salon: null },
                });
            })
            .catch((error) => {
                alert(error);
            });
    };

    // Context data
    const authContextData = {
        loginSalon,
        logoutSalon,
        authState,
        dispatch,
    };

    // Return provider
    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
