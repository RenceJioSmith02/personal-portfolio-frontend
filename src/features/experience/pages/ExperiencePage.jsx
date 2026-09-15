import {
    useCallback,
    useEffect,
    useState,
} from "react";

import ExperienceForm
    from "../components/ExperienceForm";

import ExperienceList
    from "../components/ExperienceList";

import {
    createExperience,
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

    return (
        <div
            className={
                "experience-page"
            }
        >

            <header
                className={
                    "experience-page__header"
                }
            >

                <div>
                    <h1>
                        Experience Management
                    </h1>

                    <p>
                        Manage the work experiences
                        displayed in your portfolio.
                    </p>
                </div>

                <button
                    type="button"
                    className={
                        "experience-button "
                        + "experience-button--primary"
                    }
                    onClick={
                        openCreateModal
                    }
                >
                    Create Experience
                </button>

            </header>

            {
                pageError && (
                    <div
                        className={
                            "experience-alert "
                            + "experience-alert--error"
                        }
                    >
                        {pageError}
                    </div>
                )
            }

            {
                loading
                    ? (
                        <p>
                            Loading experiences...
                        </p>
                    )
                    : (
                        <ExperienceList
                            experiences={
                                experiences
                            }
                            onEdit={
                                openUpdateModal
                            }
                        />
                    )
            }

            {
                isFormOpen && (
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
                )
            }

        </div>
    );
}