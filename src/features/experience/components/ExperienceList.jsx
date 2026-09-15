function formatDate(dateValue) {

    if (!dateValue) {
        return "Not specified";
    }

    return new Intl.DateTimeFormat(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
        }
    ).format(
        new Date(
            `${dateValue}T00:00:00Z`
        )
    );
}

export default function ExperienceList({
    experiences,
    onEdit,
}) {

    if (experiences.length === 0) {

        return (
            <div
                className={
                    "experience-empty-state"
                }
            >
                <h2>
                    No experiences found
                </h2>

                <p>
                    Click Create Experience to
                    add your first work experience.
                </p>
            </div>
        );
    }

    return (
        <div
            className={
                "experience-table-wrapper"
            }
        >

            <table
                className={
                    "experience-table"
                }
            >

                <thead>
                    <tr>
                        <th>
                            Company
                        </th>

                        <th>
                            Position
                        </th>

                        <th>
                            Duration
                        </th>

                        <th>
                            Order
                        </th>

                        <th>
                            Status
                        </th>

                        <th
                            className={
                                "experience-table__actions"
                            }
                        >
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {
                        experiences.map(
                            experience => (

                                <tr
                                    key={
                                        experience.id
                                    }
                                >

                                    <td>
                                        <strong>
                                            {
                                                experience
                                                    .company
                                            }
                                        </strong>
                                    </td>

                                    <td>
                                        {
                                            experience
                                                .position
                                        }
                                    </td>

                                    <td>
                                        {
                                            formatDate(
                                                experience
                                                    .startDate
                                            )
                                        }

                                        {" - "}

                                        {
                                            experience
                                                .currentlyWorking
                                                ? "Present"
                                                : formatDate(
                                                    experience
                                                        .endDate
                                                )
                                        }
                                    </td>

                                    <td>
                                        {
                                            experience
                                                .displayOrder
                                        }
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                experience
                                                    .published
                                                    ? "experience-badge experience-badge--published"
                                                    : "experience-badge experience-badge--draft"
                                            }
                                        >
                                            {
                                                experience
                                                    .published
                                                    ? "Published"
                                                    : "Draft"
                                            }
                                        </span>
                                    </td>

                                    <td
                                        className={
                                            "experience-table__actions"
                                        }
                                    >
                                        <button
                                            type="button"
                                            className={
                                                "experience-button "
                                                + "experience-button--secondary"
                                            }
                                            onClick={
                                                () => onEdit(
                                                    experience
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
                                    </td>

                                </tr>
                            )
                        )
                    }

                </tbody>

            </table>

        </div>
    );
}