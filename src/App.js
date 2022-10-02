import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./components/auth/Auth";
// import Auth from "./components/auth/Auth.js";
// import ProtectedRoute from "./components/routing/ProtectedRoute.js";
// import DashBoard from "./components/DashBoard";

function App() {
    return (
        // <Routes>
        //     <Route path="/" element={<Navigate to="/login" replace />} />
        //     <Route path="/login" element={<Auth authRoute="login" />} />
        //     <Route path="/register" element={<Auth authRoute="register" />} />
        //     <Route path="/dashboard/*" element={<ProtectedRoute />} />
        // </Routes>
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Auth authRoute="login" />} />
            <Route path="/register" element={<Auth authRoute="register" />} />

            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard/*" element={<DashBoard></DashBoard>} /> */}
        </Routes>
    );
}

export default App;
