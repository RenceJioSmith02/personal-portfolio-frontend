import {
    useEffect,
    useState,
} from "react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const MODULE_COLORS = {
    Experiences:
        "#80bfff",

    Services:
        "#63ead3",

    Capabilities:
        "#a78bfa",

    Projects:
        "#fbbf24",
};

const DEFAULT_BAR_COLOR =
    "#80bfff";

const MOBILE_BREAKPOINT =
    640;

function getModuleColor(
    moduleName
) {

    return (
        MODULE_COLORS[
            moduleName
        ]
        || DEFAULT_BAR_COLOR
    );
}

function hasChartRecords(
    data
) {

    return (
        Array.isArray(data)
        && data.some(
            item =>
                Number(item.total) > 0
        )
    );
}

function ContentOverviewTooltip({
    active,
    payload,
    label,
}) {

    if (
        !active
        || !payload
        || payload.length === 0
    ) {
        return null;
    }

    const total =
        payload[0]
            ?.value
        ?? 0;

    const color =
        getModuleColor(
            label
        );

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
                <span
                    className={
                        "dashboard-chart-tooltip__indicator"
                    }
                    style={{
                        backgroundColor:
                            color,
                    }}
                    aria-hidden="true"
                />

                <strong>
                    {label}
                </strong>
            </div>

            <div
                className={
                    "dashboard-chart-tooltip__content"
                }
            >
                <span>
                    Total records
                </span>

                <strong>
                    {total}
                </strong>
            </div>
        </div>
    );
}

export default function ContentOverviewChart({
    data = [],
}) {

    const [
        isMobile,
        setIsMobile,
    ] = useState(
        () =>
            typeof window !== "undefined"
            && window.innerWidth
            <= MOBILE_BREAKPOINT
    );

    useEffect(() => {

        function handleResize() {

            setIsMobile(
                window.innerWidth
                <= MOBILE_BREAKPOINT
            );
        }

        window.addEventListener(
            "resize",
            handleResize
        );

        handleResize();

        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            );
        };

    }, []);

    const normalizedData =
        Array.isArray(data)
            ? data.map(
                item => ({
                    module:
                        item.module
                        ?? "Unknown",

                    total:
                        Number(
                            item.total
                        )
                        || 0,
                })
            )
            : [];

    const totalContent =
        normalizedData.reduce(
            (
                total,
                item
            ) =>
                total
                + item.total,
            0
        );

    const chartHasRecords =
        hasChartRecords(
            normalizedData
        );

    return (
        <section
            className={
                "dashboard-chart-card"
            }
            aria-labelledby={
                "content-overview-title"
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
                            "content-overview-title"
                        }
                        className={
                            "dashboard-chart-card__title"
                        }
                    >
                        Content Overview
                    </h2>

                    <p
                        className={
                            "dashboard-chart-card__description"
                        }
                    >
                        Compare the total number of
                        records across your portfolio
                        modules.
                    </p>
                </div>

                <div
                    className={
                        "dashboard-chart-card__total"
                    }
                    aria-label={
                        `${totalContent} total content records`
                    }
                >
                    <strong>
                        {totalContent}
                    </strong>

                    <span>
                        Total Content
                    </span>
                </div>
            </header>

            {
                chartHasRecords
                    ? (
                        <div
                            className={
                                "dashboard-chart-card__canvas "
                                + (
                                    isMobile
                                        ? "dashboard-chart-card__canvas--mobile"
                                        : ""
                                )
                            }
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                {
                                    isMobile
                                        ? (
                                            <BarChart
                                                data={
                                                    normalizedData
                                                }
                                                layout="vertical"
                                                margin={{
                                                    top: 12,
                                                    right: 34,
                                                    bottom: 8,
                                                    left: 12,
                                                }}
                                            >
                                                <CartesianGrid
                                                    stroke={
                                                        "rgba(148, 163, 184, 0.14)"
                                                    }
                                                    horizontal={
                                                        false
                                                    }
                                                />

                                                <XAxis
                                                    type="number"
                                                    allowDecimals={
                                                        false
                                                    }
                                                    axisLine={
                                                        false
                                                    }
                                                    tickLine={
                                                        false
                                                    }
                                                    tick={{
                                                        fill:
                                                            "#94a3b8",
                                                        fontSize:
                                                            12,
                                                    }}
                                                />

                                                <YAxis
                                                    type="category"
                                                    dataKey={
                                                        "module"
                                                    }
                                                    width={94}
                                                    axisLine={
                                                        false
                                                    }
                                                    tickLine={
                                                        false
                                                    }
                                                    tick={{
                                                        fill:
                                                            "#cbd5e1",
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
                                                        <ContentOverviewTooltip />
                                                    }
                                                />

                                                <Bar
                                                    dataKey={
                                                        "total"
                                                    }
                                                    radius={[
                                                        0,
                                                        8,
                                                        8,
                                                        0,
                                                    ]}
                                                    maxBarSize={
                                                        32
                                                    }
                                                >
                                                    {
                                                        normalizedData.map(
                                                            item => (
                                                                <Cell
                                                                    key={
                                                                        item.module
                                                                    }
                                                                    fill={
                                                                        getModuleColor(
                                                                            item.module
                                                                        )
                                                                    }
                                                                />
                                                            )
                                                        )
                                                    }

                                                    <LabelList
                                                        dataKey={
                                                            "total"
                                                        }
                                                        position={
                                                            "right"
                                                        }
                                                        fill={
                                                            "#e2e8f0"
                                                        }
                                                        fontSize={
                                                            12
                                                        }
                                                        fontWeight={
                                                            700
                                                        }
                                                    />
                                                </Bar>
                                            </BarChart>
                                        )
                                        : (
                                            <BarChart
                                                data={
                                                    normalizedData
                                                }
                                                margin={{
                                                    top: 24,
                                                    right: 18,
                                                    bottom: 12,
                                                    left: 0,
                                                }}
                                            >
                                                <CartesianGrid
                                                    stroke={
                                                        "rgba(148, 163, 184, 0.14)"
                                                    }
                                                    vertical={
                                                        false
                                                    }
                                                />

                                                <XAxis
                                                    dataKey={
                                                        "module"
                                                    }
                                                    axisLine={
                                                        false
                                                    }
                                                    tickLine={
                                                        false
                                                    }
                                                    tick={{
                                                        fill:
                                                            "#cbd5e1",
                                                        fontSize:
                                                            12,
                                                    }}
                                                    tickMargin={
                                                        12
                                                    }
                                                />

                                                <YAxis
                                                    allowDecimals={
                                                        false
                                                    }
                                                    axisLine={
                                                        false
                                                    }
                                                    tickLine={
                                                        false
                                                    }
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
                                                        <ContentOverviewTooltip />
                                                    }
                                                />

                                                <Bar
                                                    dataKey={
                                                        "total"
                                                    }
                                                    radius={[
                                                        8,
                                                        8,
                                                        0,
                                                        0,
                                                    ]}
                                                    maxBarSize={
                                                        72
                                                    }
                                                >
                                                    {
                                                        normalizedData.map(
                                                            item => (
                                                                <Cell
                                                                    key={
                                                                        item.module
                                                                    }
                                                                    fill={
                                                                        getModuleColor(
                                                                            item.module
                                                                        )
                                                                    }
                                                                />
                                                            )
                                                        )
                                                    }

                                                    <LabelList
                                                        dataKey={
                                                            "total"
                                                        }
                                                        position={
                                                            "top"
                                                        }
                                                        fill={
                                                            "#e2e8f0"
                                                        }
                                                        fontSize={
                                                            12
                                                        }
                                                        fontWeight={
                                                            700
                                                        }
                                                    />
                                                </Bar>
                                            </BarChart>
                                        )
                                }
                            </ResponsiveContainer>
                        </div>
                    )
                    : (
                        <div
                            className={
                                "dashboard-chart-card__empty"
                            }
                        >
                            <strong>
                                No content available
                            </strong>

                            <span>
                                Create content in any
                                portfolio module to display
                                the overview chart.
                            </span>
                        </div>
                    )
            }

            {/* {
                normalizedData.length > 0 && (
                    <div
                        className={
                            "dashboard-chart-card__legend"
                        }
                    >
                        {
                            normalizedData.map(
                                item => (
                                    <div
                                        key={
                                            item.module
                                        }
                                        className={
                                            "dashboard-chart-card__legend-item"
                                        }
                                    >
                                        <span
                                            className={
                                                "dashboard-chart-card__legend-color"
                                            }
                                            style={{
                                                backgroundColor:
                                                    getModuleColor(
                                                        item.module
                                                    ),
                                            }}
                                        />

                                        <span>
                                            {
                                                item.module
                                            }
                                        </span>

                                        <strong>
                                            {
                                                item.total
                                            }
                                        </strong>
                                    </div>
                                )
                            )
                        }
                    </div>
                )
            } */}
        </section>
    );
}