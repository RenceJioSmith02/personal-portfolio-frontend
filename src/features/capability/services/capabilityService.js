import axiosClient
    from "../../../shared/api/axiosClient";

/**
 * GET
 * /api/v1/admin/capabilities
 */
export async function getCapabilities() {

    const response =
        await axiosClient.get(
            "/admin/capabilities"
        );

    return response.data;
}

/**
 * GET
 * /api/v1/admin/capabilities/{id}
 */
export async function getCapabilityById(
    id
) {

    const response =
        await axiosClient.get(
            `/admin/capabilities/${id}`
        );

    return response.data;
}

/**
 * POST
 * /api/v1/admin/capabilities
 */
export async function createCapability(
    payload
) {

    const response =
        await axiosClient.post(
            "/admin/capabilities",
            payload
        );

    return response.data;
}

/**
 * PUT
 * /api/v1/admin/capabilities/{id}
 */
export async function updateCapability(
    id,
    payload
) {

    const response =
        await axiosClient.put(
            `/admin/capabilities/${id}`,
            payload
        );

    return response.data;
}

/**
 * DELETE
 * /api/v1/admin/capabilities/{id}
 */
export async function deleteCapability(
    id
) {

    await axiosClient.delete(
        `/admin/capabilities/${id}`
    );
}