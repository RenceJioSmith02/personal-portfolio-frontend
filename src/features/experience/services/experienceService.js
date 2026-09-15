import axiosClient
    from "../../../shared/api/axiosClient";

export async function getExperiences() {

    const response =
        await axiosClient.get(
            "/admin/experiences"
        );

    return response.data;
}

export async function createExperience(
    payload
) {

    const response =
        await axiosClient.post(
            "/admin/experiences",
            payload
        );

    return response.data;
}

export async function updateExperience(
    id,
    payload
) {

    const response =
        await axiosClient.put(
            `/admin/experiences/${id}`,
            payload
        );

    return response.data;
}

export async function deleteExperience(
    id
) {

    await axiosClient.delete(
        `/admin/experiences/${id}`
    );
}