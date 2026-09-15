import {
    Link,
} from "react-router-dom";

export default function DashboardStatCard({
    title,
    total,
    published,
    draft,
    publishedPercentage,
    icon,
    linkTo,
}) {

    const content = (
        <>
            <div
                className={
                    "dashboard-stat-card__header"
                }
            >
                <div
                    className={
                        "dashboard-stat-card__icon"
                    }
                >
                    {icon}
                </div>

                <div
                    className={
                        "dashboard-stat-card__title-group"
                    }
                >
                    <span
                        className={
                            "dashboard-stat-card__title"
                        }
                    >
                        {title}
                    </span>

                    <span
                        className={
                            "dashboard-stat-card__subtitle"
                        }
                    >
                        Portfolio Module
                    </span>
                </div>
            </div>

            <div
                className={
                    "dashboard-stat-card__body"
                }
            >
                <div
                    className={
                        "dashboard-stat-card__total"
                    }
                >
                    {total}
                </div>

                <div
                    className={
                        "dashboard-stat-card__label"
                    }
                >
                    Total Records
                </div>
            </div>

            <div
                className={
                    "dashboard-stat-card__footer"
                }
            >
                <div
                    className={
                        "dashboard-stat-card__metric"
                    }
                >
                    <span
                        className={
                            "dashboard-stat-card__metric-label"
                        }
                    >
                        Published
                    </span>

                    <span
                        className={
                            "dashboard-stat-card__metric-value "
                            + "dashboard-stat-card__metric-value--published"
                        }
                    >
                        {published}
                    </span>
                </div>

                <div
                    className={
                        "dashboard-stat-card__metric"
                    }
                >
                    <span
                        className={
                            "dashboard-stat-card__metric-label"
                        }
                    >
                        Draft
                    </span>

                    <span
                        className={
                            "dashboard-stat-card__metric-value "
                            + "dashboard-stat-card__metric-value--draft"
                        }
                    >
                        {draft}
                    </span>
                </div>
            </div>

            <div
                className={
                    "dashboard-stat-card__progress-section"
                }
            >
                <div
                    className={
                        "dashboard-stat-card__progress-header"
                    }
                >
                    <span>
                        Published
                    </span>

                    <span>
                        {publishedPercentage}%
                    </span>
                </div>

                <div
                    className={
                        "dashboard-stat-card__progress"
                    }
                >
                    <div
                        className={
                            "dashboard-stat-card__progress-bar"
                        }
                        style={{
                            width:
                                `${publishedPercentage}%`,
                        }}
                    />
                </div>
            </div>
        </>
    );

    if (!linkTo) {
        return (
            <div
                className={
                    "dashboard-stat-card"
                }
            >
                {content}
            </div>
        );
    }

    return (
        <Link
            to={linkTo}
            className={
                "dashboard-stat-card"
            }
        >
            {content}
        </Link>
    );
}