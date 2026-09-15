import {
    getExperiences,
} from "../../experience/services/experienceService";

import {
    getServices,
} from "../../service/services/serviceService";

import {
    getCapabilities,
} from "../../capability/services/capabilityService";

import {
    getProjects,
} from "../../project/services/projectService";

export async function getDashboardData() {

    const [
        experiences,
        services,
        capabilities,
        projects,
    ] = await Promise.all([
        getExperiences(),
        getServices(),
        getCapabilities(),
        getProjects(),
    ]);

    return {
        experiences:
            experiences
            ?? [],

        services:
            services
            ?? [],

        capabilities:
            capabilities
            ?? [],

        projects:
            projects
            ?? [],
    };
}