// import React, { useContext } from "react";
import Login from "./Login";
import Register from "./Register";
// import { Spin } from "antd";
// import { AuthContext } from "../../contexts/AuthContext";
// import { Navigate } from "react-router-dom";

const Auth = ({ authRoute }) => {
    // const {
    //     authState: { authLoading, isAuthenticated },
    // } = useContext(AuthContext);

    return (
        <>
            {/* {authLoading ? (
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin />
                </div>
            ) : isAuthenticated ? (
                <Navigate to="/dashboard" />
            ) : (
                <>
                    {authRoute === "login" && <Login />}
                    {authRoute === "register" && <Register />}
                </>
            )} */}

            {authRoute === "login" && <Login />}
            {authRoute === "register" && <Register />}
        </>
    );
};

export default Auth;
