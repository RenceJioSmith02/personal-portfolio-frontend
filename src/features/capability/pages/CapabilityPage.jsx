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

import CapabilityForm
    from "../components/CapabilityForm";

import CapabilityList
    from "../components/CapabilityList";

import {
    createCapability,
    deleteCapability,
    getCapabilities,
    updateCapability,
} from "../services/capabilityService";

import "../styles/capability.css";

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

const CATEGORY_FILTER_OPTIONS = [
    {
        value: "all",
        label: "All categories",
    },
    {
        value: "Frontend",
        label: "Frontend",
    },
    {
        value: "Backend",
        label: "Backend",
    },
    {
        value: "Database",
        label: "Database",
    },
    {
        value: "DevOps",
        label: "DevOps",
    },
    {
        value: "Cloud",
        label: "Cloud",
    },
    {
        value: "Testing",
        label: "Testing",
    },
    {
        value: "Tools",
        label: "Tools",
    },
    {
        value: "Mobile",
        label: "Mobile",
    },
    {
        value: "Architecture",
        label: "Architecture",
    },
    {
        value: "Security",
        label: "Security",
    },
    {
        value: "Data",
        label: "Data",
    },
    {
        value: "Artificial Intelligence",
        label: "Artificial Intelligence",
    },
    {
        value: "Soft Skills",
        label: "Soft Skills",
    },
];

const PROFICIENCY_FILTER_OPTIONS = [
    {
        value: "all",
        label: "All levels",
    },
    {
        value: "Beginner",
        label: "Beginner",
    },
    {
        value: "Intermediate",
        label: "Intermediate",
    },
    {
        value: "Advanced",
        label: "Advanced",
    },
    {
        value: "Expert",
        label: "Expert",
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
        || fallbackMessage
    );
}

export default function CapabilityPage() {

    const {
        showToast,
    } = useToast();

    const [
        capabilities,
        setCapabilities,
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
        categoryFilter,
        setCategoryFilter,
    ] = useState("all");

    const [
        proficiencyFilter,
        setProficiencyFilter,
    ] = useState("all");

    const [
        isFormOpen,
        setIsFormOpen,
    ] = useState(false);

    const [
        selectedCapability,
        setSelectedCapability,
    ] = useState(null);

    const [
        capabilityToDelete,
        setCapabilityToDelete,
    ] = useState(null);

    const loadCapabilities =
        useCallback(
            async ({
                showConfirmation = false,
            } = {}) => {

                setPageError("");

                try {

                    const data =
                        await getCapabilities();

                    setCapabilities(data);

                    if (showConfirmation) {

                        showToast(
                            "Capability list refreshed.",
                            "info"
                        );
                    }

                } catch (exception) {

                    const message =
                        getErrorMessage(
                            exception,
                            "Unable to load capabilities."
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

        loadCapabilities()
            .catch(() => {
                // Page error is already handled.
            });

    }, [
        loadCapabilities,
    ]);

    const filteredCapabilities =
        useMemo(
            () => {

                const normalizedSearch =
                    searchTerm
                        .trim()
                        .toLowerCase();

                return capabilities.filter(
                    capability => {

                        const matchesSearch =
                            !normalizedSearch
                            || [
                                capability.name,
                                capability.category,
                                capability.proficiencyLevel,
                                capability.icon,
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
                                && capability.published
                            )
                            || (
                                statusFilter
                                === "draft"
                                && !capability.published
                            );

                        const matchesCategory =
                            categoryFilter === "all"
                            || capability.category
                                === categoryFilter;

                        const matchesProficiency =
                            proficiencyFilter === "all"
                            || capability.proficiencyLevel
                                === proficiencyFilter;

                        return (
                            matchesSearch
                            && matchesStatus
                            && matchesCategory
                            && matchesProficiency
                        );
                    }
                );
            },
            [
                capabilities,
                searchTerm,
                statusFilter,
                categoryFilter,
                proficiencyFilter,
            ]
        );

    const filters = [
        {
            id:
                "capability-status-filter",
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
                "capability-category-filter",
            label:
                "Category",
            value:
                categoryFilter,
            onChange:
                setCategoryFilter,
            options:
                CATEGORY_FILTER_OPTIONS,
        },
        {
            id:
                "capability-proficiency-filter",
            label:
                "Level",
            value:
                proficiencyFilter,
            onChange:
                setProficiencyFilter,
            options:
                PROFICIENCY_FILTER_OPTIONS,
        },
    ];

    const hasActiveFilters =
        Boolean(
            searchTerm.trim()
        )
        || statusFilter !== "all"
        || categoryFilter !== "all"
        || proficiencyFilter !== "all";

    function openCreateModal() {

        setSelectedCapability(null);
        setIsFormOpen(true);
    }

    function openUpdateModal(
        capability
    ) {

        setSelectedCapability(
            capability
        );

        setIsFormOpen(true);
    }

    function closeFormModal() {

        if (submitting) {
            return;
        }

        setSelectedCapability(null);
        setIsFormOpen(false);
    }

    function openDeleteDialog(
        capability
    ) {

        setCapabilityToDelete(
            capability
        );
    }

    function closeDeleteDialog() {

        if (deleting) {
            return;
        }

        setCapabilityToDelete(null);
    }

    async function handleRefresh() {

        setRefreshing(true);

        try {

            await loadCapabilities({
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
                selectedCapability
            );

        try {

            if (isEditing) {

                await updateCapability(
                    selectedCapability.id,
                    payload
                );

            } else {

                await createCapability(
                    payload
                );
            }

            await loadCapabilities();

            setSelectedCapability(null);
            setIsFormOpen(false);

            showToast(
                isEditing
                    ? "Capability updated successfully."
                    : "Capability created successfully.",
                "success"
            );

        } catch (exception) {

            const message =
                getErrorMessage(
                    exception,
                    isEditing
                        ? "Unable to update capability."
                        : "Unable to create capability."
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

        if (!capabilityToDelete) {
            return;
        }

        setDeleting(true);
        setPageError("");

        try {

            await deleteCapability(
                capabilityToDelete.id
            );

            await loadCapabilities();

            setCapabilityToDelete(null);

            showToast(
                "Capability deleted successfully.",
                "success"
            );

        } catch (exception) {

            const message =
                getErrorMessage(
                    exception,
                    "Unable to delete capability."
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
        selectedCapability
            ? "Update Capability"
            : "Create Capability";

    const deleteMessage =
        capabilityToDelete
            ? `Delete capability "${capabilityToDelete.name}"? This action cannot be undone.`
            : "";

    return (
        <div
            className={
                "capability-page"
            }
        >
            <PageHeader
                title={
                    "Capability Management"
                }
                description={
                    "Manage technical and professional "
                    + "capabilities displayed in your portfolio."
                }
                actionLabel={
                    "Create Capability"
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
                    "Search name, category, level, or icon"
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
                    filteredCapabilities.length
                }
            />

            {
                pageError && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "capability-page__alert"
                        }
                        role="alert"
                    >
                        {pageError}
                    </div>
                )
            }

            <CapabilityList
                capabilities={
                    filteredCapabilities
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
                size="medium"
            >
                <CapabilityForm
                    key={
                        selectedCapability
                            ?.id
                        ?? "create"
                    }
                    capability={
                        selectedCapability
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
                        capabilityToDelete
                    )
                }
                title={
                    "Delete Capability"
                }
                message={
                    deleteMessage
                }
                confirmLabel={
                    "Delete Capability"
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