import {
    useCallback,
    useEffect,
    useState,
} from "react";

import ConfirmDialog
    from "../../../shared/components/ConfirmDialog/ConfirmDialog";

import Modal
    from "../../../shared/components/Modal/Modal";

import PageHeader
    from "../../../shared/components/PageHeader/PageHeader";

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

export default function ExperiencePage() {

    const [
        experiences,
        setExperiences,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

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
        useCallback(async () => {

            setPageError("");

            try {

                const data =
                    await getExperiences();

                setExperiences(data);

            } catch (exception) {

                const message =
                    exception.response
                        ?.data
                        ?.message;

                setPageError(
                    message
                    || "Unable to load experiences."
                );

            } finally {

                setLoading(false);
            }

        }, []);

    useEffect(() => {

        loadExperiences();

    }, [loadExperiences]);

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

    async function handleSubmit(
        payload
    ) {

        setSubmitting(true);

        try {

            if (selectedExperience) {

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

        } catch (exception) {

            const message =
                exception.response
                    ?.data
                    ?.message;

            setPageError(
                message
                || "Unable to delete experience."
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
                    experiences
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