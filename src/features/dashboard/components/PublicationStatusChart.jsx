import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const STATUS_COLORS = {
    Published: "#63ead3",
    Draft: "#f87171",
};

function PublicationTooltip({
    active,
    payload,
}) {

    if (
        !active
        || !payload
        || payload.length === 0
    ) {
        return null;
    }

    const item =
        payload[0];

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
                    {item.name}
                </strong>
            </div>

            <div
                className={
                    "dashboard-chart-tooltip__content"
                }
            >
                <span>
                    Records
                </span>

                <strong>
                    {item.value}
                </strong>
            </div>
        </div>
    );
}

export default function PublicationStatusChart({
    data = [],
    totalRecords = 0,
}) {

    const hasData =
        Array.isArray(data)
        && data.some(
            item =>
                item.value > 0
        );

    if (!hasData) {

        return (
            <section
                className={
                    "dashboard-chart-card"
                }
            >
                <header
                    className={
                        "dashboard-chart-card__header"
                    }
                >
                    <h2
                        className={
                            "dashboard-chart-card__title"
                        }
                    >
                        Publication Status
                    </h2>
                </header>

                <div
                    className={
                        "dashboard-chart-card__empty"
                    }
                >
                    <strong>
                        No publication data
                    </strong>

                    <span>
                        Create content to visualise
                        publication statistics.
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section
            className={
                "dashboard-chart-card"
            }
        >
            <header
                className={
                    "dashboard-chart-card__header"
                }
            >
                <div>
                    <h2
                        className={
                            "dashboard-chart-card__title"
                        }
                    >
                        Publication Status
                    </h2>

                    <p
                        className={
                            "dashboard-chart-card__description"
                        }
                    >
                        Published versus draft
                        content across all
                        portfolio modules.
                    </p>
                </div>
            </header>

            <div
                className={
                    "publication-chart"
                }
            >
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={4}
                            stroke="none"
                        >
                            {
                                data.map(
                                    item => (
                                        <Cell
                                            key={
                                                item.name
                                            }
                                            fill={
                                                STATUS_COLORS[
                                                    item.name
                                                ]
                                            }
                                        />
                                    )
                                )
                            }
                        </Pie>

                        <Tooltip
                            content={
                                <PublicationTooltip />
                            }
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div
                    className={
                        "publication-chart__center"
                    }
                >
                    <strong>
                        {totalRecords}
                    </strong>

                    <span>
                        Total
                    </span>
                </div>
            </div>

            <div
                className={
                    "publication-chart__legend"
                }
            >
                {
                    data.map(
                        item => {

                            const percentage =
                                totalRecords === 0
                                    ? 0
                                    : Math.round(
                                        (
                                            item.value
                                            / totalRecords
                                        ) * 100
                                    );

                            return (
                                <div
                                    key={
                                        item.name
                                    }
                                    className={
                                        "publication-chart__legend-item"
                                    }
                                >
                                    <span
                                        className={
                                            "publication-chart__legend-color"
                                        }
                                        style={{
                                            backgroundColor:
                                                STATUS_COLORS[
                                                    item.name
                                                ],
                                        }}
                                    />

                                    <div
                                        className={
                                            "publication-chart__legend-content"
                                        }
                                    >
                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span>
                                            {item.value}
                                            {" "}
                                            items
                                            {" "}
                                            (
                                            {percentage}
                                            %)
                                        </span>
                                    </div>
                                </div>
                            );
                        }
                    )
                }
            </div>
        </section>
    );
}