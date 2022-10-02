import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import Login from "./Login";
import Register from "./Register";

const Auth = ({ authRoute }) => {
    const navigate = useNavigate();
    const [isLoged, setIsLoged] = useState(true);

    useEffect(() => {
        onAuthStateChanged(getAuth(), (salon) => {
            if (salon) {
                navigate("/dashboard");
            } else {
                setIsLoged(false);
            }
        });
    }, [navigate]);

    return (
        <>
            {isLoged ? (
                <Loading />
            ) : (
                <>
                    {authRoute === "login" && <Login />}
                    {authRoute === "register" && <Register />}
                </>
            )}
        </>
    );
};

export default Auth;
