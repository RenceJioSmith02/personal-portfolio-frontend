import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    useAuth,
} from "../../features/auth/context/AuthContext";

export default function ProtectedRoute({
    children,
}) {

    const location =
        useLocation();

    const {
        accessToken,
    } = useAuth();

    if (!accessToken) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    return children;
}