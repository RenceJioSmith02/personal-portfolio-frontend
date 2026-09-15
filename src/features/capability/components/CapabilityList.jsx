import Button
    from "../../../shared/components/Button/Button";

import DataTable
    from "../../../shared/components/DataTable/DataTable";

import {
    SERVICE_ICONS,
} from "../../../shared/constants/serviceIcons";

function formatIconLabel(
    iconKey
) {

    if (!iconKey) {
        return "No icon";
    }

    return iconKey
        .replace(
            /([A-Z])/g,
            " $1"
        )
        .replace(
            /^./,
            firstCharacter =>
                firstCharacter.toUpperCase()
        );
}

function getProficiencyClassName(
    proficiencyLevel
) {

    const normalizedLevel =
        proficiencyLevel
            ?.trim()
            .toLowerCase();

    switch (normalizedLevel) {

        case "beginner":
            return (
                "capability-level "
                + "capability-level--beginner"
            );

        case "intermediate":
            return (
                "capability-level "
                + "capability-level--intermediate"
            );

        case "advanced":
            return (
                "capability-level "
                + "capability-level--advanced"
            );

        case "expert":
            return (
                "capability-level "
                + "capability-level--expert"
            );

        default:
            return "capability-level";
    }
}

function CapabilityIcon({
    iconKey,
}) {

    const IconComponent =
        SERVICE_ICONS[
            iconKey
        ];

    if (!IconComponent) {

        return (
            <div
                className={
                    "capability-list__icon "
                    + "capability-list__icon--empty"
                }
                title={
                    iconKey
                    || "No icon"
                }
                aria-label={
                    iconKey
                        ? `Unknown icon: ${iconKey}`
                        : "No icon"
                }
            >
                N/A
            </div>
        );
    }

    return (
        <div
            className={
                "capability-list__icon"
            }
            title={
                formatIconLabel(
                    iconKey
                )
            }
            aria-label={
                formatIconLabel(
                    iconKey
                )
            }
        >
            <IconComponent
                size={22}
                strokeWidth={2}
                aria-hidden="true"
            />
        </div>
    );
}

export default function CapabilityList({
    capabilities,
    loading,
    onCreate,
    onEdit,
    onDelete,
    hasActiveFilters = false,
}) {

    const columns = [
        {
            id: "icon",
            header: "Icon",
            render: capability => (
                <CapabilityIcon
                    iconKey={
                        capability.icon
                    }
                />
            ),
        },
        {
            id: "name",
            header: "Name",
            render: capability => (
                <strong>
                    {
                        capability.name
                    }
                </strong>
            ),
        },
        {
            id: "category",
            header: "Category",
            render: capability => (
                <span
                    className={
                        "capability-category"
                    }
                >
                    {
                        capability.category
                    }
                </span>
            ),
        },
        {
            id: "proficiencyLevel",
            header: "Level",
            render: capability => (
                <span
                    className={
                        getProficiencyClassName(
                            capability
                                .proficiencyLevel
                        )
                    }
                >
                    {
                        capability
                            .proficiencyLevel
                    }
                </span>
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
            render: capability => (
                <span
                    className={
                        capability.published
                            ? "admin-status admin-status--published"
                            : "admin-status admin-status--draft"
                    }
                >
                    {
                        capability.published
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
            render: capability => (
                <div
                    className={
                        "capability-list__actions"
                    }
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={
                            () => onEdit(
                                capability
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
                            () => onDelete(
                                capability
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
            rows={capabilities}
            getRowKey={
                capability =>
                    capability.id
            }
            loading={loading}
            ariaLabel={
                "Capability management table"
            }
            emptyTitle={
                hasActiveFilters
                    ? "No matching capabilities"
                    : "No capabilities found"
            }
            emptyDescription={
                hasActiveFilters
                    ? "Try changing your search or filters."
                    : "Create your first capability to display it in your portfolio."
            }
            emptyActionLabel={
                hasActiveFilters
                    ? undefined
                    : "Create Capability"
            }
            onEmptyAction={
                hasActiveFilters
                    ? undefined
                    : onCreate
            }
        />
    );
}