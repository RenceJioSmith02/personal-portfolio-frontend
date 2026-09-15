import axiosClient
    from "../../../shared/api/axiosClient";

export async function getServices() {

    const response =
        await axiosClient.get(
            "/admin/services"
        );

    return response.data;
}

export async function createService(
    payload
) {

    const response =
        await axiosClient.post(
            "/admin/services",
            payload
        );

    return response.data;
}

export async function updateService(
    id,
    payload
) {

    const response =
        await axiosClient.put(
            `/admin/services/${id}`,
            payload
        );

    return response.data;
}

export async function deleteService(
    id
) {

    await axiosClient.delete(
        `/admin/services/${id}`
    );
}