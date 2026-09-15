import axiosClient from "../../../shared/api/axiosClient";

export async function login(credentials) {
    const response = await axiosClient.post(
        "/auth/login",
        credentials
    );

    return response.data;
}

export async function logout(
    refreshToken
) {
    await axiosClient.post(
        "/auth/logout",
        {
            refreshToken,
        }
    );
}

export async function getCurrentUser() {
    const response = await axiosClient.get(
        "/auth/me"
    );

    return response.data;
}