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

import ServiceForm
    from "../components/ServiceForm";

import ServiceList
    from "../components/ServiceList";

import {
    createService,
    deleteService,
    getServices,
    updateService,
} from "../services/serviceService";

import "../styles/service.css";

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

function getErrorMessage(
    exception,
    fallbackMessage
) {

    return exception.response
        ?.data
        ?.message
        || fallbackMessage;
}

export default function ServicePage() {

    const {
        showToast,
    } = useToast();

    const [
        services,
        setServices,
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
        isFormOpen,
        setIsFormOpen,
    ] = useState(false);

    const [
        selectedService,
        setSelectedService,
    ] = useState(null);

    const [
        serviceToDelete,
        setServiceToDelete,
    ] = useState(null);

    const loadServices =
        useCallback(
            async ({
                showConfirmation = false,
            } = {}) => {

                setPageError("");

                try {

                    const data =
                        await getServices();

                    setServices(data);

                    if (showConfirmation) {

                        showToast(
                            "Service list refreshed.",
                            "info"
                        );
                    }

                } catch (exception) {

                    const message =
                        getErrorMessage(
                            exception,
                            "Unable to load services."
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

        loadServices()
            .catch(() => {
                // Page error is already handled.
            });

    }, [
        loadServices,
    ]);

    const filteredServices =
        useMemo(
            () => {

                const normalizedSearch =
                    searchTerm
                        .trim()
                        .toLowerCase();

                return services.filter(
                    service => {

                        const matchesSearch =
                            !normalizedSearch
                            || [
                                service.title,
                                service.description,
                                service.icon,
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
                                && service.published
                            )
                            || (
                                statusFilter
                                === "draft"
                                && !service.published
                            );

                        return (
                            matchesSearch
                            && matchesStatus
                        );
                    }
                );
            },
            [
                services,
                searchTerm,
                statusFilter,
            ]
        );

    const filters = [
        {
            id:
                "service-status-filter",
            label:
                "Status",
            value:
                statusFilter,
            onChange:
                setStatusFilter,
            options:
                STATUS_FILTER_OPTIONS,
        },
    ];

    const hasActiveFilters =
        Boolean(
            searchTerm.trim()
        )
        || statusFilter !== "all";

    function openCreateModal() {

        setSelectedService(null);
        setIsFormOpen(true);
    }

    function openUpdateModal(
        service
    ) {

        setSelectedService(
            service
        );

        setIsFormOpen(true);
    }

    function closeFormModal() {

        if (submitting) {
            return;
        }

        setIsFormOpen(false);
        setSelectedService(null);
    }

    function openDeleteDialog(
        service
    ) {

        setServiceToDelete(
            service
        );
    }

    function closeDeleteDialog() {

        if (deleting) {
            return;
        }

        setServiceToDelete(null);
    }

    async function handleRefresh() {

        setRefreshing(true);

        try {

            await loadServices({
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
                selectedService
            );

        try {

            if (isEditing) {

                await updateService(
                    selectedService.id,
                    payload
                );

            } else {

                await createService(
                    payload
                );
            }

            await loadServices();

            setIsFormOpen(false);
            setSelectedService(null);

            showToast(
                isEditing
                    ? "Service updated successfully."
                    : "Service created successfully.",
                "success"
            );

        } catch (exception) {

            const message =
                getErrorMessage(
                    exception,
                    isEditing
                        ? "Unable to update service."
                        : "Unable to create service."
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

        if (!serviceToDelete) {
            return;
        }

        setDeleting(true);
        setPageError("");

        try {

            await deleteService(
                serviceToDelete.id
            );

            await loadServices();

            setServiceToDelete(null);

            showToast(
                "Service deleted successfully.",
                "success"
            );

        } catch (exception) {

            const message =
                getErrorMessage(
                    exception,
                    "Unable to delete service."
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
        selectedService
            ? "Update Service"
            : "Create Service";

    const deleteMessage =
        serviceToDelete
            ? `Delete the service "${serviceToDelete.title}"? This action cannot be undone.`
            : "";

    return (
        <div
            className={
                "service-page"
            }
        >
            <PageHeader
                title={
                    "Service Management"
                }
                description={
                    "Manage the services displayed "
                    + "in your public portfolio."
                }
                actionLabel={
                    "Create Service"
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
                    "Search title, description, or icon"
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
                    filteredServices.length
                }
            />

            {
                pageError && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "service-page__alert"
                        }
                        role="alert"
                    >
                        {pageError}
                    </div>
                )
            }

            <ServiceList
                services={
                    filteredServices
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
                <ServiceForm
                    key={
                        selectedService
                            ?.id
                        ?? "create"
                    }
                    service={
                        selectedService
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
                        serviceToDelete
                    )
                }
                title={
                    "Delete Service"
                }
                message={
                    deleteMessage
                }
                confirmLabel={
                    "Delete Service"
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