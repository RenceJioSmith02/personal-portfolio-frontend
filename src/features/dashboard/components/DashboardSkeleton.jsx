export default function DashboardSkeleton() {

    return (
        <div
            className={
                "dashboard-page "
                + "dashboard-skeleton-layout"
            }
            aria-busy="true"
            aria-label={
                "Loading dashboard"
            }
        >
            <div
                className={
                    "dashboard-skeleton-header"
                }
            >
                <div
                    className={
                        "dashboard-skeleton-block "
                        + "dashboard-skeleton-header__title"
                    }
                />

                <div
                    className={
                        "dashboard-skeleton-block "
                        + "dashboard-skeleton-header__text"
                    }
                />
            </div>

            <div
                className={
                    "dashboard-skeleton-toolbar"
                }
            >
                <div
                    className={
                        "dashboard-skeleton-block "
                        + "dashboard-skeleton-toolbar__summary"
                    }
                />

                <div
                    className={
                        "dashboard-skeleton-block "
                        + "dashboard-skeleton-toolbar__button"
                    }
                />
            </div>

            <div
                className={
                    "dashboard-stats"
                }
            >
                {
                    Array.from({
                        length: 4,
                    }).map(
                        (
                            _,
                            index
                        ) => (
                            <div
                                key={index}
                                className={
                                    "dashboard-skeleton-card"
                                }
                            >
                                <div
                                    className={
                                        "dashboard-skeleton-card__header"
                                    }
                                >
                                    <div
                                        className={
                                            "dashboard-skeleton-block "
                                            + "dashboard-skeleton-card__icon"
                                        }
                                    />

                                    <div
                                        className={
                                            "dashboard-skeleton-card__heading"
                                        }
                                    >
                                        <div
                                            className={
                                                "dashboard-skeleton-block "
                                                + "dashboard-skeleton-card__title"
                                            }
                                        />

                                        <div
                                            className={
                                                "dashboard-skeleton-block "
                                                + "dashboard-skeleton-card__subtitle"
                                            }
                                        />
                                    </div>
                                </div>

                                <div
                                    className={
                                        "dashboard-skeleton-block "
                                        + "dashboard-skeleton-card__value"
                                    }
                                />

                                <div
                                    className={
                                        "dashboard-skeleton-block "
                                        + "dashboard-skeleton-card__line"
                                    }
                                />

                                <div
                                    className={
                                        "dashboard-skeleton-block "
                                        + "dashboard-skeleton-card__progress"
                                    }
                                />
                            </div>
                        )
                    )
                }
            </div>

            <div
                className={
                    "dashboard-analytics"
                }
            >
                <div
                    className={
                        "dashboard-skeleton-chart"
                    }
                >
                    <div
                        className={
                            "dashboard-skeleton-block "
                            + "dashboard-skeleton-chart__title"
                        }
                    />

                    <div
                        className={
                            "dashboard-skeleton-block "
                            + "dashboard-skeleton-chart__canvas"
                        }
                    />
                </div>

                <div
                    className={
                        "dashboard-skeleton-chart"
                    }
                >
                    <div
                        className={
                            "dashboard-skeleton-block "
                            + "dashboard-skeleton-chart__title"
                        }
                    />

                    <div
                        className={
                            "dashboard-skeleton-block "
                            + "dashboard-skeleton-chart__canvas"
                        }
                    />
                </div>
            </div>

            <span
                className={
                    "admin-sr-only"
                }
            >
                Dashboard content is loading.
            </span>
        </div>
    );
}