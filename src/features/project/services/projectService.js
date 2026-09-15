import axiosClient
    from "../../../shared/api/axiosClient";

const PROJECT_ENDPOINT =
    "/admin/projects";

export async function getProjects() {

    const response =
        await axiosClient.get(
            PROJECT_ENDPOINT
        );

    return response.data;
}

export async function getProjectById(
    id
) {

    const response =
        await axiosClient.get(
            `${PROJECT_ENDPOINT}/${id}`
        );

    return response.data;
}

export async function createProject(
    projectData
) {

    const response =
        await axiosClient.post(
            PROJECT_ENDPOINT,
            projectData
        );

    return response.data;
}

export async function updateProject(
    id,
    projectData
) {

    const response =
        await axiosClient.put(
            `${PROJECT_ENDPOINT}/${id}`,
            projectData
        );

    return response.data;
}

export async function deleteProject(
    id
) {

    await axiosClient.delete(
        `${PROJECT_ENDPOINT}/${id}`
    );
}