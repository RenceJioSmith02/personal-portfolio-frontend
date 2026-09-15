import Button
    from "../../../shared/components/Button/Button";

import DataTable
    from "../../../shared/components/DataTable/DataTable";

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

function formatDuration(
    experience
) {

    const startDate =
        formatDate(
            experience.startDate
        );

    const endDate =
        experience.currentlyWorking
            ? "Present"
            : formatDate(
                experience.endDate
            );

    return `${startDate} - ${endDate}`;
}

export default function ExperienceList({
    experiences,
    loading,
    onCreate,
    onEdit,
    onDelete,
    hasActiveFilters = false,
}) {

    const columns = [
        {
            id: "company",
            header: "Company",
            render: experience => (
                <strong>
                    {
                        experience.company
                    }
                </strong>
            ),
        },
        {
            id: "position",
            header: "Position",
            accessor: "position",
        },
        {
            id: "duration",
            header: "Duration",
            render: experience =>
                formatDuration(
                    experience
                ),
        },
        {
            id: "displayOrder",
            header: "Order",
            accessor: "displayOrder",
            align: "center",
        },
        {
            id: "status",
            header: "Status",
            render: experience => (
                <span
                    className={
                        experience.published
                            ? "admin-status admin-status--published"
                            : "admin-status admin-status--draft"
                    }
                >
                    {
                        experience.published
                            ? "Published"
                            : "Draft"
                    }
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            align: "right",
            render: experience => (
                <div
                    className={
                        "experience-list__actions"
                    }
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={
                            () =>
                                onEdit(
                                    experience
                                )
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={
                            () =>
                                onDelete(
                                    experience
                                )
                        }
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={experiences}
            getRowKey={
                experience =>
                    experience.id
            }
            loading={loading}
            ariaLabel={
                "Experience management table"
            }
            emptyTitle={
                hasActiveFilters
                    ? "No matching experiences"
                    : "No experiences found"
            }
            emptyDescription={
                hasActiveFilters
                    ? "Try changing your search or filters."
                    : "Create your first work experience to display it in your portfolio."
            }
            emptyActionLabel={
                hasActiveFilters
                    ? undefined
                    : "Create Experience"
            }
            onEmptyAction={
                hasActiveFilters
                    ? undefined
                    : onCreate
            }
        />
    );
}