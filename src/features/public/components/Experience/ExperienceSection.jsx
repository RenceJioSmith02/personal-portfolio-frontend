import {
    Briefcase,
    GraduationCap,
} from "lucide-react";

import "./experience.css";

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "";
    }

    return new Date(
        dateValue
    ).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
        }
    );
}

function buildPeriodLabel(
    experience
) {

    if (
        experience.currentlyWorking
    ) {

        return (
            formatDate(
                experience.startDate
            )
            + " - Present"
        );
    }

    return (
        formatDate(
            experience.startDate
        )
        + " - "
        + formatDate(
            experience.endDate
        )
    );
}

export default function ExperienceSection({
    experiences = [],
}) {

    if (
        !experiences.length
    ) {

        return (
            <section
                id="experience"
                className="
                    section
                    section--alt
                "
            >
                <div className="container">
                    <div
                        className="
                            section-heading
                        "
                    >
                        <span className="eyebrow">
                            Experience
                        </span>

                        <h2>
                            Learning translated
                            into delivery.
                        </h2>

                        <p>
                            No published
                            experience entries
                            available yet.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="experience"
            className="
                section
                section--alt
            "
        >
            <div className="container">

                <div
                    className="
                        section-heading
                        reveal
                    "
                >
                    <span className="eyebrow">
                        Experience
                    </span>

                    <h2>
                        Learning translated
                        into delivery.
                    </h2>
                </div>

                <div
                    className="
                        timeline
                    "
                >
                    {
                        experiences.map(
                            (
                                experience,
                                index
                            ) => {

                                const Icon =
                                    experience.currentlyWorking
                                        ? Briefcase
                                        : GraduationCap;

                                return (
                                    <article
                                        key={`${experience.company}-${index}`}
                                        className="
                                            timeline__item
                                            reveal
                                        "
                                        data-delay={
                                            index % 2
                                        }
                                    >
                                        <span
                                            className="
                                                timeline__icon
                                            "
                                        >
                                            <Icon
                                                size={
                                                    20
                                                }
                                            />
                                        </span>

                                        <div>
                                            <small>
                                                {
                                                    buildPeriodLabel(
                                                        experience
                                                    )
                                                }
                                            </small>

                                            <h3>
                                                {
                                                    experience.position
                                                }
                                            </h3>

                                            <strong>
                                                {
                                                    experience.company
                                                }
                                            </strong>

                                            <p>
                                                {
                                                    experience.description
                                                }
                                            </p>
                                        </div>
                                    </article>
                                );
                            }
                        )
                    }
                </div>

            </div>
        </section>
    );
}