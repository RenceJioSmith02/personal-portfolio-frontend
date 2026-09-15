import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Briefcase,
    Rocket,
    Wrench,
    Zap,
} from "lucide-react";

import Button
    from "../../../shared/components/Button/Button";

import PageHeader
    from "../../../shared/components/PageHeader/PageHeader";

import {
    useToast,
} from "../../../shared/components/Toast/ToastContext";

import ContentOverviewChart
    from "../components/ContentOverviewChart";

import DashboardQuickActions
    from "../components/DashboardQuickActions";

import DashboardSkeleton
    from "../components/DashboardSkeleton";

import DashboardStatCard
    from "../components/DashboardStatCard";

import ModuleStatusChart
    from "../components/ModuleStatusChart";

import PublicationStatusChart
    from "../components/PublicationStatusChart";

import {
    getDashboardData,
} from "../services/dashboardService";

import {
    buildDashboardSummary,
    buildModuleChartData,
    buildModuleStatusChartData,
    buildPublicationChartData,
} from "../utils/dashboardDataUtils";

import "../styles/dashboard.css";

const MODULE_CONFIG = {
    Experiences: {
        icon: (
            <Briefcase
                size={22}
                strokeWidth={2}
                aria-hidden="true"
            />
        ),

        linkTo:
            "/experiences",
    },

    Services: {
        icon: (
            <Wrench
                size={22}
                strokeWidth={2}
                aria-hidden="true"
            />
        ),

        linkTo:
            "/services",
    },

    Capabilities: {
        icon: (
            <Zap
                size={22}
                strokeWidth={2}
                aria-hidden="true"
            />
        ),

        linkTo:
            "/capabilities",
    },

    Projects: {
        icon: (
            <Rocket
                size={22}
                strokeWidth={2}
                aria-hidden="true"
            />
        ),

        linkTo:
            "/projects",
    },
};

const EMPTY_DASHBOARD_SUMMARY = {
    summaries: [],
    totalRecords: 0,
    totalPublished: 0,
    totalDraft: 0,
};

function getErrorMessage(
    exception,
    fallbackMessage
) {

    return (
        exception.response
            ?.data
            ?.message
        || exception.response
            ?.data
            ?.error
        || fallbackMessage
    );
}

export default function DashboardPage() {

    const {
        showToast,
    } = useToast();

    const [
        dashboardData,
        setDashboardData,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        pageError,
        setPageError,
    ] = useState("");

    const loadDashboard =
        useCallback(
            async ({
                showConfirmation = false,
            } = {}) => {

                setPageError("");

                try {

                    const data =
                        await getDashboardData();

                    setDashboardData(
                        data
                    );

                    if (showConfirmation) {

                        showToast(
                            "Dashboard refreshed successfully.",
                            "success"
                        );
                    }

                } catch (exception) {

                    const message =
                        getErrorMessage(
                            exception,
                            "Unable to load dashboard data."
                        );

                    setPageError(
                        message
                    );

                    if (showConfirmation) {

                        showToast(
                            message,
                            "error"
                        );
                    }

                } finally {

                    setLoading(false);
                }
            },
            [
                showToast,
            ]
        );

    useEffect(() => {

        loadDashboard();

    }, [
        loadDashboard,
    ]);

    async function handleRefresh() {

        setRefreshing(true);

        try {

            await loadDashboard({
                showConfirmation: true,
            });

        } finally {

            setRefreshing(false);
        }
    }

    const dashboardSummary =
        useMemo(
            () => {

                if (!dashboardData) {
                    return (
                        EMPTY_DASHBOARD_SUMMARY
                    );
                }

                return (
                    buildDashboardSummary(
                        dashboardData
                    )
                );
            },
            [
                dashboardData,
            ]
        );

    const moduleChartData =
        useMemo(
            () =>
                buildModuleChartData(
                    dashboardSummary.summaries
                ),
            [
                dashboardSummary.summaries,
            ]
        );

    const publicationChartData =
        useMemo(
            () =>
                buildPublicationChartData(
                    dashboardSummary
                        .totalPublished,
                    dashboardSummary
                        .totalDraft
                ),
            [
                dashboardSummary
                    .totalPublished,
                dashboardSummary
                    .totalDraft,
            ]
        );

    const moduleStatusChartData =
        useMemo(
            () =>
                buildModuleStatusChartData(
                    dashboardSummary.summaries
                ),
            [
                dashboardSummary.summaries,
            ]
        );

    if (loading) {

        return (
            <DashboardSkeleton />
        );
    }

    return (
        <div
            className={
                "dashboard-page"
            }
        >
            <PageHeader
                title="Dashboard"
                description={
                    "Portfolio CMS overview "
                    + "and content statistics."
                }
            />

            <div
                className={
                    "dashboard-toolbar"
                }
            >
                <div
                    className={
                        "dashboard-toolbar__summary"
                    }
                    aria-label={
                        "Dashboard totals"
                    }
                >
                    {/* <span>
                        Total Records:
                        {" "}
                        <strong>
                            {
                                dashboardSummary
                                    .totalRecords
                            }
                        </strong>
                    </span>

                    <span>
                        Published:
                        {" "}
                        <strong
                            className={
                                "dashboard-toolbar__published"
                            }
                        >
                            {
                                dashboardSummary
                                    .totalPublished
                            }
                        </strong>
                    </span>

                    <span>
                        Draft:
                        {" "}
                        <strong
                            className={
                                "dashboard-toolbar__draft"
                            }
                        >
                            {
                                dashboardSummary
                                    .totalDraft
                            }
                        </strong>
                    </span> */}
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    loading={
                        refreshing
                    }
                    loadingLabel={
                        "Refreshing..."
                    }
                    onClick={
                        handleRefresh
                    }
                >
                    Refresh
                </Button>
            </div>

            {
                pageError && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "dashboard-page__alert"
                        }
                        role="alert"
                    >
                        {pageError}
                    </div>
                )
            }

            <section
                aria-label={
                    "Portfolio module summaries"
                }
            >
                <div
                    className={
                        "dashboard-stats"
                    }
                >
                    {
                        dashboardSummary
                            .summaries
                            .map(
                                summary => {

                                    const moduleConfig =
                                        MODULE_CONFIG[
                                            summary.label
                                        ];

                                    return (
                                        <DashboardStatCard
                                            key={
                                                summary.label
                                            }
                                            title={
                                                summary.label
                                            }
                                            total={
                                                summary.total
                                            }
                                            published={
                                                summary
                                                    .published
                                            }
                                            draft={
                                                summary.draft
                                            }
                                            publishedPercentage={
                                                summary
                                                    .publishedPercentage
                                            }
                                            icon={
                                                moduleConfig
                                                    ?.icon
                                            }
                                            linkTo={
                                                moduleConfig
                                                    ?.linkTo
                                            }
                                        />
                                    );
                                }
                            )
                    }
                </div>
            </section>

            <div
                className={
                    "dashboard-analytics"
                }
            >
                <ContentOverviewChart
                    data={
                        moduleChartData
                    }
                />

                <PublicationStatusChart
                    data={
                        publicationChartData
                    }
                    totalRecords={
                        dashboardSummary
                            .totalRecords
                    }
                />
            </div>

            <div
                className={
                    "dashboard-lower-grid"
                }
            >
                <ModuleStatusChart
                    data={
                        moduleStatusChartData
                    }
                />

                <DashboardQuickActions />
            </div>
        </div>
    );
}