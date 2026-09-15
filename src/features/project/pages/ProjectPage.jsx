import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import ConfirmDialog
    from "../../../shared/components/ConfirmDialog/ConfirmDialog";

import CrudToolbar
    from "../../../shared/components/CrudToolbar/CrudToolbar";

import Modal
    from "../../../shared/components/Modal/Modal";

import PageHeader
    from "../../../shared/components/PageHeader/PageHeader";

import {
    useToast,
} from "../../../shared/components/Toast/ToastContext";

import ProjectForm
    from "../components/ProjectForm";

import ProjectList
    from "../components/ProjectList";

import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "../services/projectService";

import "../styles/project.css";

const STATUS_FILTER_OPTIONS = [
    {
        value: "all",
        label: "All statuses",
    },
    {
        value: "published",
        label: "Published",
    },
    {
        value: "draft",
        label: "Draft",
    },
];

const IMAGE_FILTER_OPTIONS = [
    {
        value: "all",
        label: "All images",
    },
    {
        value: "with-image",
        label: "With image",
    },
    {
        value: "without-image",
        label: "Without image",
    },
];

const LINK_FILTER_OPTIONS = [
    {
        value: "all",
        label: "All links",
    },
    {
        value: "repository",
        label: "Has repository",
    },
    {
        value: "live",
        label: "Has live demo",
    },
    {
        value: "both",
        label: "Has both links",
    },
    {
        value: "none",
        label: "No links",
    },
];

function getErrorMessage(
    exception,
    fallbackMessage
) {

    return (
        exception.response
            ?.data
            ?.message
        || exception.response
            ?.data
            ?.error
        || fallbackMessage
    );
}

export default function ProjectPage() {

    const {
        showToast,
    } = useToast();

    const [
        projects,
        setProjects,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        deleting,
        setDeleting,
    ] = useState(false);

    const [
        pageError,
        setPageError,
    ] = useState("");

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        imageFilter,
        setImageFilter,
    ] = useState("all");

    const [
        linkFilter,
        setLinkFilter,
    ] = useState("all");

    const [
        isFormOpen,
        setIsFormOpen,
    ] = useState(false);

    const [
        selectedProject,
        setSelectedProject,
    ] = useState(null);

    const [
        projectToDelete,
        setProjectToDelete,
    ] = useState(null);

    const loadProjects =
        useCallback(
            async ({
                showConfirmation = false,
            } = {}) => {

                setPageError("");

                try {

                    const data =
                        await getProjects();

                    setProjects(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                    if (showConfirmation) {

                        showToast(
                            "Project list refreshed.",
                            "info"
                        );
                    }

                } catch (exception) {

                    const message =
                        getErrorMessage(
                            exception,
                            "Unable to load projects."
                        );

                    setPageError(message);

                    if (showConfirmation) {

                        showToast(
                            message,
                            "error"
                        );
                    }

                    throw exception;

                } finally {

                    setLoading(false);
                }
            },
            [
                showToast,
            ]
        );

    useEffect(() => {

        loadProjects()
            .catch(() => {
                // Page error is already handled.
            });

    }, [
        loadProjects,
    ]);

    const filteredProjects =
        useMemo(
            () => {

                const normalizedSearch =
                    searchTerm
                        .trim()
                        .toLowerCase();

                return projects.filter(
                    project => {

                        const matchesSearch =
                            !normalizedSearch
                            || [
                                project.title,
                                project.slug,
                                project.summary,
                                project.description,
                                project.techStack,
                            ]
                                .filter(Boolean)
                                .some(
                                    value =>
                                        String(value)
                                            .toLowerCase()
                                            .includes(
                                                normalizedSearch
                                            )
                                );

                        const matchesStatus =
                            statusFilter === "all"
                            || (
                                statusFilter
                                === "published"
                                && project.published
                            )
                            || (
                                statusFilter
                                === "draft"
                                && !project.published
                            );

                        const hasImage =
                            Boolean(
                                project.imageUrl
                                    ?.trim()
                            );

                        const matchesImage =
                            imageFilter === "all"
                            || (
                                imageFilter
                                === "with-image"
                                && hasImage
                            )
                            || (
                                imageFilter
                                === "without-image"
                                && !hasImage
                            );

                        const hasRepository =
                            Boolean(
                                project.repositoryUrl
                                    ?.trim()
                            );

                        const hasLiveUrl =
                            Boolean(
                                project.liveUrl
                                    ?.trim()
                            );

                        const matchesLinks =
                            linkFilter === "all"
                            || (
                                linkFilter
                                === "repository"
                                && hasRepository
                            )
                            || (
                                linkFilter
                                === "live"
                                && hasLiveUrl
                            )
                            || (
                                linkFilter
                                === "both"
                                && hasRepository
                                && hasLiveUrl
                            )
                            || (
                                linkFilter
                                === "none"
                                && !hasRepository
                                && !hasLiveUrl
                            );

                        return (
                            matchesSearch
                            && matchesStatus
                            && matchesImage
                            && matchesLinks
                        );
                    }
                );
            },
            [
                projects,
                searchTerm,
                statusFilter,
                imageFilter,
                linkFilter,
            ]
        );

    const filters = [
        {
            id:
                "project-status-filter",
            label:
                "Status",
            value:
                statusFilter,
            onChange:
                setStatusFilter,
            options:
                STATUS_FILTER_OPTIONS,
        },
        {
            id:
                "project-image-filter",
            label:
                "Image",
            value:
                imageFilter,
            onChange:
                setImageFilter,
            options:
                IMAGE_FILTER_OPTIONS,
        },
        {
            id:
                "project-link-filter",
            label:
                "Links",
            value:
                linkFilter,
            onChange:
                setLinkFilter,
            options:
                LINK_FILTER_OPTIONS,
        },
    ];

    const hasActiveFilters =
        Boolean(
            searchTerm.trim()
        )
        || statusFilter !== "all"
        || imageFilter !== "all"
        || linkFilter !== "all";

    function openCreateModal() {

        setSelectedProject(null);
        setIsFormOpen(true);
    }

    function openUpdateModal(
        project
    ) {

        setSelectedProject(
            project
        );

        setIsFormOpen(true);
    }

    function closeFormModal() {

        if (submitting) {
            return;
        }

        setSelectedProject(null);
        setIsFormOpen(false);
    }

    function openDeleteDialog(
        project
    ) {

        setProjectToDelete(
            project
        );
    }

    function closeDeleteDialog() {

        if (deleting) {
            return;
        }

        setProjectToDelete(null);
    }

    async function handleRefresh() {

        setRefreshing(true);

        try {

            await loadProjects({
                showConfirmation: true,
            });

        } catch {
            // Toast and page error are already handled.
        } finally {

            setRefreshing(false);
        }
    }

    async function refreshAfterSave() {

        try {

            await loadProjects();

        } catch {

            setPageError(
                "The project was saved, "
                + "but the project list could "
                + "not be refreshed."
            );
        }
    }

    async function handleSubmit(
        payload
    ) {

        setSubmitting(true);
        setPageError("");

        const isEditing =
            Boolean(
                selectedProject
            );

        try {

            if (isEditing) {

                await updateProject(
                    selectedProject.id,
                    payload
                );

            } else {

                await createProject(
                    payload
                );
            }

            setSelectedProject(null);
            setIsFormOpen(false);

            showToast(
                isEditing
                    ? "Project updated successfully."
                    : "Project created successfully.",
                "success"
            );

            await refreshAfterSave();

        } catch (exception) {

            const message =
                getErrorMessage(
                    exception,
                    isEditing
                        ? "Unable to update project."
                        : "Unable to create project."
                );

            showToast(
                message,
                "error"
            );

            throw exception;

        } finally {

            setSubmitting(false);
        }
    }

    async function handleDelete() {

        if (!projectToDelete) {
            return;
        }

        setDeleting(true);
        setPageError("");

        try {

            await deleteProject(
                projectToDelete.id
            );

            setProjectToDelete(null);

            showToast(
                "Project deleted successfully.",
                "success"
            );

            try {

                await loadProjects();

            } catch {

                setPageError(
                    "The project was deleted, "
                    + "but the project list could "
                    + "not be refreshed."
                );
            }

        } catch (exception) {

            const message =
                getErrorMessage(
                    exception,
                    "Unable to delete project."
                );

            setPageError(message);

            showToast(
                message,
                "error"
            );

        } finally {

            setDeleting(false);
        }
    }

    const formTitle =
        selectedProject
            ? "Update Project"
            : "Create Project";

    const deleteMessage =
        projectToDelete
            ? `Delete project "${projectToDelete.title}"? This action cannot be undone.`
            : "";

    return (
        <div
            className={
                "project-page"
            }
        >
            <PageHeader
                title={
                    "Project Management"
                }
                description={
                    "Manage portfolio projects, "
                    + "images, links, technologies, "
                    + "and publishing status."
                }
                actionLabel={
                    "Create Project"
                }
                onAction={
                    openCreateModal
                }
            />

            <CrudToolbar
                searchValue={
                    searchTerm
                }
                searchPlaceholder={
                    "Search title, slug, summary, or tech stack"
                }
                onSearchChange={
                    setSearchTerm
                }
                filters={
                    filters
                }
                onRefresh={
                    handleRefresh
                }
                refreshing={
                    refreshing
                }
                resultCount={
                    filteredProjects.length
                }
            />

            {
                pageError && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "project-page__alert"
                        }
                        role="alert"
                    >
                        {pageError}
                    </div>
                )
            }

            <ProjectList
                projects={
                    filteredProjects
                }
                loading={
                    loading
                }
                onCreate={
                    openCreateModal
                }
                onEdit={
                    openUpdateModal
                }
                onDelete={
                    openDeleteDialog
                }
                hasActiveFilters={
                    hasActiveFilters
                }
            />

            <Modal
                open={
                    isFormOpen
                }
                title={
                    formTitle
                }
                onClose={
                    closeFormModal
                }
                busy={
                    submitting
                }
                size="large"
            >
                <ProjectForm
                    key={
                        selectedProject
                            ?.id
                        ?? "create"
                    }
                    project={
                        selectedProject
                    }
                    submitting={
                        submitting
                    }
                    onSubmit={
                        handleSubmit
                    }
                    onCancel={
                        closeFormModal
                    }
                />
            </Modal>

            <ConfirmDialog
                open={
                    Boolean(
                        projectToDelete
                    )
                }
                title={
                    "Delete Project"
                }
                message={
                    deleteMessage
                }
                confirmLabel={
                    "Delete Project"
                }
                cancelLabel={
                    "Cancel"
                }
                busy={
                    deleting
                }
                variant="danger"
                onConfirm={
                    handleDelete
                }
                onCancel={
                    closeDeleteDialog
                }
            />
        </div>
    );
}