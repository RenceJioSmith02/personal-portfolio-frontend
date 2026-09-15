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

import ExperienceForm
    from "../components/ExperienceForm";

import ExperienceList
    from "../components/ExperienceList";

import {
    createExperience,
    deleteExperience,
    getExperiences,
    updateExperience,
} from "../services/experienceService";

import "../styles/experience.css";

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

const EMPLOYMENT_FILTER_OPTIONS = [
    {
        value: "all",
        label: "All experiences",
    },
    {
        value: "current",
        label: "Currently working",
    },
    {
        value: "past",
        label: "Past experience",
    },
];

function getErrorMessage(
    exception,
    fallbackMessage
) {

    return exception.response
        ?.data
        ?.message
        || fallbackMessage;
}

export default function ExperiencePage() {

    const {
        showToast,
    } = useToast();

    const [
        experiences,
        setExperiences,
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
        employmentFilter,
        setEmploymentFilter,
    ] = useState("all");

    const [
        isFormOpen,
        setIsFormOpen,
    ] = useState(false);

    const [
        selectedExperience,
        setSelectedExperience,
    ] = useState(null);

    const [
        experienceToDelete,
        setExperienceToDelete,
    ] = useState(null);

    const loadExperiences =
        useCallback(
            async ({
                showConfirmation = false,
            } = {}) => {

                setPageError("");

                try {

                    const data =
                        await getExperiences();

                    setExperiences(data);

                    if (showConfirmation) {

                        showToast(
                            "Experience list refreshed.",
                            "info"
                        );
                    }

                } catch (exception) {

                    const message =
                        getErrorMessage(
                            exception,
                            "Unable to load experiences."
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

        loadExperiences()
            .catch(() => {
                // Page error is already handled.
            });

    }, [
        loadExperiences,
    ]);

    const filteredExperiences =
        useMemo(
            () => {

                const normalizedSearch =
                    searchTerm
                        .trim()
                        .toLowerCase();

                return experiences.filter(
                    experience => {

                        const matchesSearch =
                            !normalizedSearch
                            || [
                                experience.company,
                                experience.position,
                                experience.description,
                            ]
                                .filter(Boolean)
                                .some(
                                    value =>
                                        value
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
                                && experience.published
                            )
                            || (
                                statusFilter
                                === "draft"
                                && !experience.published
                            );

                        const matchesEmployment =
                            employmentFilter === "all"
                            || (
                                employmentFilter
                                === "current"
                                && experience
                                    .currentlyWorking
                            )
                            || (
                                employmentFilter
                                === "past"
                                && !experience
                                    .currentlyWorking
                            );

                        return (
                            matchesSearch
                            && matchesStatus
                            && matchesEmployment
                        );
                    }
                );
            },
            [
                experiences,
                searchTerm,
                statusFilter,
                employmentFilter,
            ]
        );

    const filters = [
        {
            id:
                "experience-status-filter",
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
                "experience-employment-filter",
            label:
                "Employment",
            value:
                employmentFilter,
            onChange:
                setEmploymentFilter,
            options:
                EMPLOYMENT_FILTER_OPTIONS,
        },
    ];

    function openCreateModal() {

        setSelectedExperience(null);
        setIsFormOpen(true);
    }

    function openUpdateModal(
        experience
    ) {

        setSelectedExperience(
            experience
        );

        setIsFormOpen(true);
    }

    function closeFormModal() {

        if (submitting) {
            return;
        }

        setIsFormOpen(false);
        setSelectedExperience(null);
    }

    function openDeleteDialog(
        experience
    ) {

        setExperienceToDelete(
            experience
        );
    }

    function closeDeleteDialog() {

        if (deleting) {
            return;
        }

        setExperienceToDelete(null);
    }

    async function handleRefresh() {

        setRefreshing(true);

        try {

            await loadExperiences({
                showConfirmation: true,
            });

        } catch {
            // Toast and page error are already handled.
        } finally {

            setRefreshing(false);
        }
    }

    async function handleSubmit(
        payload
    ) {

        setSubmitting(true);
        setPageError("");

        const isEditing =
            Boolean(
                selectedExperience
            );

        try {

            if (isEditing) {

                await updateExperience(
                    selectedExperience.id,
                    payload
                );

            } else {

                await createExperience(
                    payload
                );
            }

            await loadExperiences();

            setIsFormOpen(false);
            setSelectedExperience(null);

            showToast(
                isEditing
                    ? "Experience updated successfully."
                    : "Experience created successfully.",
                "success"
            );

        } catch (exception) {

            const message =
                getErrorMessage(
                    exception,
                    isEditing
                        ? "Unable to update experience."
                        : "Unable to create experience."
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

        if (!experienceToDelete) {
            return;
        }

        setDeleting(true);
        setPageError("");

        try {

            await deleteExperience(
                experienceToDelete.id
            );

            await loadExperiences();

            setExperienceToDelete(null);

            showToast(
                "Experience deleted successfully.",
                "success"
            );

        } catch (exception) {

            const message =
                getErrorMessage(
                    exception,
                    "Unable to delete experience."
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
        selectedExperience
            ? "Update Experience"
            : "Create Experience";

    const deleteMessage =
        experienceToDelete
            ? `Delete the experience "${experienceToDelete.position}" at "${experienceToDelete.company}"? This action cannot be undone.`
            : "";

    return (
        <div
            className={
                "experience-page"
            }
        >
            <PageHeader
                title={
                    "Experience Management"
                }
                description={
                    "Manage the work experiences "
                    + "displayed in your portfolio."
                }
                actionLabel={
                    "Create Experience"
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
                    "Search company, position, or description"
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
                    filteredExperiences.length
                }
            />

            {
                pageError && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "experience-page__alert"
                        }
                        role="alert"
                    >
                        {pageError}
                    </div>
                )
            }

            <ExperienceList
                experiences={
                    filteredExperiences
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
                    Boolean(
                        searchTerm.trim()
                    )
                    || statusFilter
                        !== "all"
                    || employmentFilter
                        !== "all"
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
                size="medium"
            >
                <ExperienceForm
                    key={
                        selectedExperience
                            ?.id
                        ?? "create"
                    }
                    experience={
                        selectedExperience
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
                        experienceToDelete
                    )
                }
                title={
                    "Delete Experience"
                }
                message={
                    deleteMessage
                }
                confirmLabel={
                    "Delete Experience"
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