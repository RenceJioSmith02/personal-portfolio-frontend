import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const PUBLISHED_COLOR =
    "#63ead3";

const DRAFT_COLOR =
    "#fb7185";

function normalizeModuleStatusData(
    data
) {

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map(
        item => ({
            module:
                String(
                    item?.module
                    ?? "Unknown"
                ),

            published:
                Number(
                    item?.published
                )
                || 0,

            draft:
                Number(
                    item?.draft
                )
                || 0,
        })
    );
}

function ModuleStatusTooltip({
    active,
    payload,
    label,
}) {

    if (
        !active
        || !Array.isArray(payload)
        || payload.length === 0
    ) {
        return null;
    }

    const published =
        Number(
            payload.find(
                item =>
                    item.dataKey
                    === "published"
            )?.value
        )
        || 0;

    const draft =
        Number(
            payload.find(
                item =>
                    item.dataKey
                    === "draft"
            )?.value
        )
        || 0;

    return (
        <div
            className={
                "dashboard-chart-tooltip"
            }
        >
            <div
                className={
                    "dashboard-chart-tooltip__header"
                }
            >
                <strong>
                    {label}
                </strong>
            </div>

            <div
                className={
                    "module-status-tooltip__list"
                }
            >
                <div
                    className={
                        "module-status-tooltip__item"
                    }
                >
                    <span
                        className={
                            "module-status-tooltip__indicator"
                        }
                        style={{
                            backgroundColor:
                                PUBLISHED_COLOR,
                        }}
                        aria-hidden="true"
                    />

                    <span>
                        Published
                    </span>

                    <strong>
                        {published}
                    </strong>
                </div>

                <div
                    className={
                        "module-status-tooltip__item"
                    }
                >
                    <span
                        className={
                            "module-status-tooltip__indicator"
                        }
                        style={{
                            backgroundColor:
                                DRAFT_COLOR,
                        }}
                        aria-hidden="true"
                    />

                    <span>
                        Draft
                    </span>

                    <strong>
                        {draft}
                    </strong>
                </div>
            </div>
        </div>
    );
}

function ModuleStatusLegend() {

    return (
        <div
            className={
                "module-status-chart__legend"
            }
        >
            <div
                className={
                    "module-status-chart__legend-item"
                }
            >
                <span
                    className={
                        "module-status-chart__legend-color"
                    }
                    style={{
                        backgroundColor:
                            PUBLISHED_COLOR,
                    }}
                    aria-hidden="true"
                />

                <span>
                    Published
                </span>
            </div>

            <div
                className={
                    "module-status-chart__legend-item"
                }
            >
                <span
                    className={
                        "module-status-chart__legend-color"
                    }
                    style={{
                        backgroundColor:
                            DRAFT_COLOR,
                    }}
                    aria-hidden="true"
                />

                <span>
                    Draft
                </span>
            </div>
        </div>
    );
}

export default function ModuleStatusChart({
    data = [],
}) {

    const normalizedData =
        normalizeModuleStatusData(
            data
        );

    const hasData =
        normalizedData.some(
            item =>
                item.published > 0
                || item.draft > 0
        );

    const totalPublished =
        normalizedData.reduce(
            (
                total,
                item
            ) =>
                total
                + item.published,
            0
        );

    const totalDraft =
        normalizedData.reduce(
            (
                total,
                item
            ) =>
                total
                + item.draft,
            0
        );

    return (
        <section
            className={
                "dashboard-chart-card "
                + "module-status-chart-card"
            }
            aria-labelledby={
                "module-status-title"
            }
        >
            <header
                className={
                    "dashboard-chart-card__header"
                }
            >
                <div>
                    <h2
                        id={
                            "module-status-title"
                        }
                        className={
                            "dashboard-chart-card__title"
                        }
                    >
                        Module Publication Status
                    </h2>

                    <p
                        className={
                            "dashboard-chart-card__description"
                        }
                    >
                        Compare published and draft
                        records for every portfolio
                        module.
                    </p>
                </div>

                <div
                    className={
                        "module-status-chart__summary"
                    }
                >
                    <div>
                        <strong
                            className={
                                "module-status-chart__published"
                            }
                        >
                            {totalPublished}
                        </strong>

                        <span>
                            Published
                        </span>
                    </div>

                    <div>
                        <strong
                            className={
                                "module-status-chart__draft"
                            }
                        >
                            {totalDraft}
                        </strong>

                        <span>
                            Draft
                        </span>
                    </div>
                </div>
            </header>

            {
                hasData
                    ? (
                        <div
                            className={
                                "module-status-chart__canvas"
                            }
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                                minWidth={0}
                            >
                                <BarChart
                                    data={
                                        normalizedData
                                    }
                                    margin={{
                                        top: 16,
                                        right: 18,
                                        bottom: 8,
                                        left: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        stroke={
                                            "rgba(148, 163, 184, 0.14)"
                                        }
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="module"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill:
                                                "#cbd5e1",
                                            fontSize:
                                                12,
                                        }}
                                        tickMargin={12}
                                    />

                                    <YAxis
                                        allowDecimals={
                                            false
                                        }
                                        axisLine={false}
                                        tickLine={false}
                                        width={34}
                                        tick={{
                                            fill:
                                                "#94a3b8",
                                            fontSize:
                                                12,
                                        }}
                                    />

                                    <Tooltip
                                        cursor={{
                                            fill:
                                                "rgba(128, 191, 255, 0.06)",
                                        }}
                                        content={
                                            <ModuleStatusTooltip />
                                        }
                                    />

                                    <Legend
                                        content={
                                            <ModuleStatusLegend />
                                        }
                                    />

                                    <Bar
                                        dataKey="published"
                                        name="Published"
                                        stackId="status"
                                        fill={
                                            PUBLISHED_COLOR
                                        }
                                        radius={[
                                            0,
                                            0,
                                            0,
                                            0,
                                        ]}
                                        maxBarSize={64}
                                        animationDuration={
                                            650
                                        }
                                    />

                                    <Bar
                                        dataKey="draft"
                                        name="Draft"
                                        stackId="status"
                                        fill={
                                            DRAFT_COLOR
                                        }
                                        radius={[
                                            8,
                                            8,
                                            0,
                                            0,
                                        ]}
                                        maxBarSize={64}
                                        animationDuration={
                                            650
                                        }
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )
                    : (
                        <div
                            className={
                                "dashboard-chart-card__empty"
                            }
                            role="status"
                        >
                            <strong>
                                No module status data
                            </strong>

                            <span>
                                Create portfolio content
                                to display module
                                publication statistics.
                            </span>
                        </div>
                    )
            }

        </section>
    );
}