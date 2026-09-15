import Button
    from "../../../shared/components/Button/Button";

import DataTable
    from "../../../shared/components/DataTable/DataTable";

import {
    resolveProjectImageUrl,
} from "../utils/projectImageUtils";

function truncateText(
    value,
    maximumLength = 90
) {

    if (!value) {
        return "";
    }

    if (
        value.length <= maximumLength
    ) {
        return value;
    }

    return (
        value.slice(
            0,
            maximumLength
        ) + "..."
    );
}

function parseTechStack(
    techStack
) {

    if (!techStack) {
        return [];
    }

    return techStack
        .split(",")
        .map(
            technology =>
                technology.trim()
        )
        .filter(Boolean);
}

function ProjectThumbnail({
    project,
}) {

    const imageSource =
        resolveProjectImageUrl(
            project.imageUrl
        );

    if (!imageSource) {

        return (
            <div
                className={
                    "project-list__thumbnail "
                    + "project-list__thumbnail--empty"
                }
                aria-label="No project image"
            >
                No Image
            </div>
        );
    }

    return (
        <div
            className={
                "project-list__thumbnail"
            }
        >
            <img
                src={imageSource}
                alt={
                    project.title
                        ? `${project.title} preview`
                        : "Project preview"
                }
                className={
                    "project-list__thumbnail-image"
                }
                onError={(event) => {
                    event.currentTarget.style.display = "none";

                    const fallback =
                        event.currentTarget.nextElementSibling;

                    if (fallback) {
                        fallback.style.display = "flex";
                    }
                }}
            />

            <span
                className={
                    "project-list__thumbnail-fallback"
                }
                style={{
                    display: "none",
                }}
            >
                Image unavailable
            </span>
        </div>
    );
}

function ProjectLinks({
    project,
}) {

    const hasRepository =
        Boolean(
            project.repositoryUrl
        );

    const hasLiveUrl =
        Boolean(
            project.liveUrl
        );

    if (
        !hasRepository
        && !hasLiveUrl
    ) {

        return (
            <span
                className={
                    "project-list__no-links"
                }
            >
                No links
            </span>
        );
    }

    return (
        <div
            className={
                "project-list__links"
            }
        >
            {
                hasRepository && (
                    <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={
                            "project-list__link"
                        }
                    >
                        Repository
                    </a>
                )
            }

            {
                hasLiveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={
                            "project-list__link"
                        }
                    >
                        Live Demo
                    </a>
                )
            }
        </div>
    );
}

export default function ProjectList({
    projects,
    loading,
    onCreate,
    onEdit,
    onDelete,
    hasActiveFilters = false,
}) {

    const columns = [
        {
            id: "image",
            header: "Image",
            render: project => (
                <ProjectThumbnail
                    project={project}
                />
            ),
        },
        {
            id: "project",
            header: "Project",
            render: project => (
                <div
                    className={
                        "project-list__details"
                    }
                >
                    <strong
                        className={
                            "project-list__title"
                        }
                    >
                        {project.title}
                    </strong>

                    <span
                        className={
                            "project-list__summary"
                        }
                        title={
                            project.summary
                        }
                    >
                        {
                            truncateText(
                                project.summary
                            )
                        }
                    </span>
                </div>
            ),
        },
        {
            id: "slug",
            header: "Slug",
            render: project => (
                <code
                    className={
                        "project-list__slug"
                    }
                >
                    {project.slug}
                </code>
            ),
        },
        {
            id: "techStack",
            header: "Tech Stack",
            render: project => {

                const technologies =
                    parseTechStack(
                        project.techStack
                    );

                if (
                    technologies.length === 0
                ) {

                    return (
                        <span
                            className={
                                "project-list__empty-value"
                            }
                        >
                            Not specified
                        </span>
                    );
                }

                const visibleTechnologies =
                    technologies.slice(
                        0,
                        3
                    );

                const remainingCount =
                    technologies.length
                    - visibleTechnologies.length;

                return (
                    <div
                        className={
                            "project-list__tech-stack"
                        }
                        title={
                            technologies.join(
                                ", "
                            )
                        }
                    >
                        {
                            visibleTechnologies.map(
                                technology => (
                                    <span
                                        key={
                                            technology
                                        }
                                        className={
                                            "project-list__tech-tag"
                                        }
                                    >
                                        {technology}
                                    </span>
                                )
                            )
                        }

                        {
                            remainingCount > 0 && (
                                <span
                                    className={
                                        "project-list__tech-tag "
                                        + "project-list__tech-tag--more"
                                    }
                                >
                                    +
                                    {remainingCount}
                                </span>
                            )
                        }
                    </div>
                );
            },
        },
        {
            id: "links",
            header: "Links",
            render: project => (
                <ProjectLinks
                    project={project}
                />
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
            render: project => (
                <span
                    className={
                        project.published
                            ? "admin-status admin-status--published"
                            : "admin-status admin-status--draft"
                    }
                >
                    {
                        project.published
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
            render: project => (
                <div
                    className={
                        "project-list__actions"
                    }
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={() =>
                            onEdit(
                                project
                            )
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() =>
                            onDelete(
                                project
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
            rows={projects}
            getRowKey={
                project =>
                    project.id
            }
            loading={loading}
            ariaLabel={
                "Project management table"
            }
            emptyTitle={
                hasActiveFilters
                    ? "No matching projects"
                    : "No projects found"
            }
            emptyDescription={
                hasActiveFilters
                    ? "Try changing your search or filters."
                    : "Create your first project to display it in your portfolio."
            }
            emptyActionLabel={
                hasActiveFilters
                    ? undefined
                    : "Create Project"
            }
            onEmptyAction={
                hasActiveFilters
                    ? undefined
                    : onCreate
            }
        />
    );
}