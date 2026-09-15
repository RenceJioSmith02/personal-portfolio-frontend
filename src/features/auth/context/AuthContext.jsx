import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    logout as logoutRequest,
} from "../services/authService";

const AuthContext =
    createContext(null);

export function AuthProvider({
    children,
}) {

    const [user, setUser] =
        useState(null);

    const [accessToken,
        setAccessToken] =
        useState(
            localStorage.getItem(
                "accessToken"
            )
        );

    const [refreshToken,
        setRefreshToken] =
        useState(
            localStorage.getItem(
                "refreshToken"
            )
        );

    const login = (
        accessTokenValue,
        refreshTokenValue
    ) => {

        localStorage.setItem(
            "accessToken",
            accessTokenValue
        );

        localStorage.setItem(
            "refreshToken",
            refreshTokenValue
        );

        setAccessToken(
            accessTokenValue
        );

        setRefreshToken(
            refreshTokenValue
        );
    };

    const logout = async () => {

        try {

            if (refreshToken) {

                await logoutRequest(
                    refreshToken
                );
            }

        } catch {

            // Ignore backend logout failures

        }

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    useEffect(() => {

        async function loadUser() {

            if (!accessToken) {
                return;
            }

            try {

                const currentUser =
                    await getCurrentUser();

                setUser(
                    currentUser
                );

            } catch {

                await logout();
            }
        }

        loadUser();

    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                refreshToken,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(
        AuthContext
    );
}