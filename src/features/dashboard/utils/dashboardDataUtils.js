function calculatePublishedCount(
    records
) {

    return records.filter(
        record =>
            record.published
    ).length;
}

export function createModuleSummary(
    label,
    records
) {

    const total =
        records.length;

    const published =
        calculatePublishedCount(
            records
        );

    const draft =
        total - published;

    const publishedPercentage =
        total === 0
            ? 0
            : Math.round(
                (
                    published
                    / total
                ) * 100
            );

    return {
        label,
        total,
        published,
        draft,
        publishedPercentage,
    };
}

export function buildDashboardSummary(
    dashboardData
) {

    const experienceSummary =
        createModuleSummary(
            "Experiences",
            dashboardData.experiences
        );

    const serviceSummary =
        createModuleSummary(
            "Services",
            dashboardData.services
        );

    const capabilitySummary =
        createModuleSummary(
            "Capabilities",
            dashboardData.capabilities
        );

    const projectSummary =
        createModuleSummary(
            "Projects",
            dashboardData.projects
        );

    const summaries = [
        experienceSummary,
        serviceSummary,
        capabilitySummary,
        projectSummary,
    ];

    const totalRecords =
        summaries.reduce(
            (
                total,
                summary
            ) =>
                total
                + summary.total,
            0
        );

    const totalPublished =
        summaries.reduce(
            (
                total,
                summary
            ) =>
                total
                + summary.published,
            0
        );

    const totalDraft =
        summaries.reduce(
            (
                total,
                summary
            ) =>
                total
                + summary.draft,
            0
        );

    return {
        summaries,
        totalRecords,
        totalPublished,
        totalDraft,
    };
}

export function buildModuleChartData(
    summaries
) {

    return summaries.map(
        summary => ({
            module:
                summary.label,

            total:
                summary.total,
        })
    );
}

export function buildPublicationChartData(
    totalPublished,
    totalDraft
) {

    return [
        {
            name:
                "Published",

            value:
                totalPublished,
        },
        {
            name:
                "Draft",

            value:
                totalDraft,
        },
    ];
}

export function buildModuleStatusChartData(
    summaries
) {

    return summaries.map(
        summary => ({
            module:
                summary.label,

            published:
                summary.published,

            draft:
                summary.draft,
        })
    );
}
