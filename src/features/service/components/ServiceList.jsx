import Button
    from "../../../shared/components/Button/Button";
import { SERVICE_ICONS } from "../../../shared/constants/serviceIcons";

import DataTable
    from "../../../shared/components/DataTable/DataTable";

function shortenDescription(
    description,
    maximumLength = 100
) {

    if (!description) {
        return "No description";
    }

    if (
        description.length
        <= maximumLength
    ) {
        return description;
    }

    return (
        description.slice(
            0,
            maximumLength
        )
        + "..."
    );
}

export default function ServiceList({
    services,
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
            render: service => {

                const IconComponent =
                    SERVICE_ICONS[
                        service.icon
                    ];

                if (!IconComponent) {

                    return (
                        <span>
                            -
                        </span>
                    );
                }

                return (
                    <IconComponent
                        size={20}
                    />
                );
            },
        },
        {
            id: "title",
            header: "Title",
            render: service => (
                <strong>
                    {service.title}
                </strong>
            ),
        },
        {
            id: "description",
            header: "Description",
            render: service => (
                <span
                    className={
                        "service-list__description"
                    }
                    title={
                        service.description
                    }
                >
                    {
                        shortenDescription(
                            service.description
                        )
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
            render: service => (
                <span
                    className={
                        service.published
                            ? "admin-status admin-status--published"
                            : "admin-status admin-status--draft"
                    }
                >
                    {
                        service.published
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
            render: service => (
                <div
                    className={
                        "service-list__actions"
                    }
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={
                            () => onEdit(
                                service
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
                                service
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
            rows={services}
            getRowKey={
                service =>
                    service.id
            }
            loading={loading}
            ariaLabel={
                "Service offering management table"
            }
            emptyTitle={
                hasActiveFilters
                    ? "No matching services"
                    : "No services found"
            }
            emptyDescription={
                hasActiveFilters
                    ? "Try changing your search or filters."
                    : "Create your first service offering to display it in your portfolio."
            }
            emptyActionLabel={
                hasActiveFilters
                    ? undefined
                    : "Create Service"
            }
            onEmptyAction={
                hasActiveFilters
                    ? undefined
                    : onCreate
            }
        />
    );
}