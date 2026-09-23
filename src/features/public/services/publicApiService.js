import axiosClient
    from "../../../shared/api/axiosClient";

const PUBLIC_API_BASE =
    "/public";

export async function getPublishedExperiences() {

    const response =
        await axiosClient.get(
            `${PUBLIC_API_BASE}/experiences`
        );

    return response.data;
}

export async function getPublishedServices() {

    const response =
        await axiosClient.get(
            `${PUBLIC_API_BASE}/services`
        );

    return response.data;
}

export async function getPublishedCapabilities() {

    const response =
        await axiosClient.get(
            `${PUBLIC_API_BASE}/capabilities`
        );

    return response.data;
}

export async function getPublishedProjects() {

    const response =
        await axiosClient.get(
            `${PUBLIC_API_BASE}/projects`
        );

    return response.data;
}

export async function getPublishedProjectBySlug(
    slug
) {

    const response =
        await axiosClient.get(
            `${PUBLIC_API_BASE}/projects/${slug}`
        );

    return response.data;
}

export async function loadHomePageData() {

    const [
        experiences,
        services,
        capabilities,
        projects,
    ] = await Promise.all([
        getPublishedExperiences(),
        getPublishedServices(),
        getPublishedCapabilities(),
        getPublishedProjects(),
    ]);

    return {
        experiences:
            experiences ?? [],

        services:
            services ?? [],

        capabilities:
            capabilities ?? [],

        projects:
            projects ?? [],
    };
}