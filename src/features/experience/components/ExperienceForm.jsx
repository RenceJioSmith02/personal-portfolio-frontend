import {
    useEffect,
    useState,
} from "react";

const EMPTY_FORM = {
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    displayOrder: 0,
    published: false,
};

function createInitialForm(
    experience
) {

    if (!experience) {
        return EMPTY_FORM;
    }

    return {
        company:
            experience.company
            ?? "",

        position:
            experience.position
            ?? "",

        description:
            experience.description
            ?? "",

        startDate:
            experience.startDate
            ?? "",

        endDate:
            experience.endDate
            ?? "",

        currentlyWorking:
            Boolean(
                experience.currentlyWorking
            ),

        displayOrder:
            experience.displayOrder
            ?? 0,

        published:
            Boolean(
                experience.published
            ),
    };
}

export default function ExperienceForm({
    experience,
    submitting,
    onSubmit,
    onCancel,
}) {

    const isEditing =
        Boolean(experience);

    const [
        formData,
        setFormData,
    ] = useState(
        () => createInitialForm(
            experience
        )
    );

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {

        function handleEscape(
            event
        ) {

            if (
                event.key === "Escape"
                && !submitting
            ) {

                onCancel();
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };

    }, [
        onCancel,
        submitting,
    ]);

    function handleChange(event) {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData(
            previousFormData => ({
                ...previousFormData,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );
    }

    function handleCurrentlyWorkingChange(
        event
    ) {

        const checked =
            event.target.checked;

        setFormData(
            previousFormData => ({
                ...previousFormData,

                currentlyWorking:
                    checked,

                endDate:
                    checked
                        ? ""
                        : previousFormData
                            .endDate,
            })
        );
    }

    function handleBackdropClick(
        event
    ) {

        if (
            event.target
            === event.currentTarget
            && !submitting
        ) {

            onCancel();
        }
    }

    async function handleSubmit(
        event
    ) {

        event.preventDefault();

        setError("");

        if (!formData.company.trim()) {

            setError(
                "Company is required."
            );

            return;
        }

        if (!formData.position.trim()) {

            setError(
                "Position is required."
            );

            return;
        }

        if (!formData.startDate) {

            setError(
                "Start date is required."
            );

            return;
        }

        if (
            formData.endDate
            && formData.endDate
            < formData.startDate
        ) {

            setError(
                "End date cannot be earlier "
                + "than start date."
            );

            return;
        }

        const displayOrder =
            Number(
                formData.displayOrder
            );

        if (
            !Number.isInteger(
                displayOrder
            )
            || displayOrder < 0
        ) {

            setError(
                "Display order must be "
                + "zero or greater."
            );

            return;
        }

        const payload = {
            company:
                formData.company.trim(),

            position:
                formData.position.trim(),

            description:
                formData.description.trim()
                || null,

            startDate:
                formData.startDate,

            endDate:
                formData.currentlyWorking
                    ? null
                    : formData.endDate
                        || null,

            currentlyWorking:
                formData.currentlyWorking,

            displayOrder,

            published:
                formData.published,
        };

        try {

            await onSubmit(payload);

        } catch (exception) {

            const backendMessage =
                exception.response
                    ?.data
                    ?.message;

            setError(
                backendMessage
                || `Unable to ${
                    isEditing
                        ? "update"
                        : "create"
                } experience.`
            );
        }
    }

    return (
        <div
            className={
                "experience-modal-backdrop"
            }
            role="presentation"
            onMouseDown={
                handleBackdropClick
            }
        >

            <section
                className={
                    "experience-modal"
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                    "experience-modal-title"
                }
            >

                <header
                    className={
                        "experience-modal__header"
                    }
                >

                    <h2
                        id={
                            "experience-modal-title"
                        }
                    >
                        {
                            isEditing
                                ? "Update Experience"
                                : "Create Experience"
                        }
                    </h2>

                    <button
                        type="button"
                        className={
                            "experience-modal__close"
                        }
                        aria-label={
                            "Close experience form"
                        }
                        disabled={
                            submitting
                        }
                        onClick={
                            onCancel
                        }
                    >
                        ×
                    </button>

                </header>

                <form
                    className={
                        "experience-form"
                    }
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div
                        className={
                            "experience-form__grid"
                        }
                    >

                        <div
                            className={
                                "experience-form__field"
                            }
                        >
                            <label
                                htmlFor="company"
                            >
                                Company
                            </label>

                            <input
                                id="company"
                                name="company"
                                type="text"
                                maxLength={255}
                                value={
                                    formData.company
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />
                        </div>

                        <div
                            className={
                                "experience-form__field"
                            }
                        >
                            <label
                                htmlFor="position"
                            >
                                Position
                            </label>

                            <input
                                id="position"
                                name="position"
                                type="text"
                                maxLength={255}
                                value={
                                    formData.position
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />
                        </div>

                        <div
                            className={
                                "experience-form__field"
                            }
                        >
                            <label
                                htmlFor="startDate"
                            >
                                Start Date
                            </label>

                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={
                                    formData.startDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />
                        </div>

                        <div
                            className={
                                "experience-form__field"
                            }
                        >
                            <label
                                htmlFor="endDate"
                            >
                                End Date
                            </label>

                            <input
                                id="endDate"
                                name="endDate"
                                type="date"
                                min={
                                    formData.startDate
                                    || undefined
                                }
                                value={
                                    formData.endDate
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    formData
                                        .currentlyWorking
                                }
                            />
                        </div>

                        <div
                            className={
                                "experience-form__field"
                            }
                        >
                            <label
                                htmlFor="displayOrder"
                            >
                                Display Order
                            </label>

                            <input
                                id="displayOrder"
                                name="displayOrder"
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    formData.displayOrder
                                }
                                onChange={
                                    handleChange
                                }
                                required={
                                    isEditing
                                }
                            />
                        </div>

                        <div
                            className={
                                "experience-form__checkboxes"
                            }
                        >
                            <label>
                                <input
                                    name={
                                        "currentlyWorking"
                                    }
                                    type="checkbox"
                                    checked={
                                        formData
                                            .currentlyWorking
                                    }
                                    onChange={
                                        handleCurrentlyWorkingChange
                                    }
                                />

                                {" "}
                                Currently working
                            </label>

                            <label>
                                <input
                                    name="published"
                                    type="checkbox"
                                    checked={
                                        formData.published
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                {" "}
                                Published
                            </label>
                        </div>

                        <div
                            className={
                                "experience-form__field "
                                + "experience-form__field--full"
                            }
                        >
                            <label
                                htmlFor="description"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                maxLength={5000}
                                rows={6}
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>

                    </div>

                    {
                        error && (
                            <div
                                className={
                                    "experience-alert "
                                    + "experience-alert--error"
                                }
                            >
                                {error}
                            </div>
                        )
                    }

                    <footer
                        className={
                            "experience-modal__footer"
                        }
                    >

                        <button
                            type="button"
                            className={
                                "experience-button "
                                + "experience-button--secondary"
                            }
                            onClick={
                                onCancel
                            }
                            disabled={
                                submitting
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={
                                "experience-button "
                                + "experience-button--primary"
                            }
                            disabled={
                                submitting
                            }
                        >
                            {
                                submitting
                                    ? "Saving..."
                                    : isEditing
                                        ? "Update Experience"
                                        : "Create Experience"
                            }
                        </button>

                    </footer>

                </form>

            </section>

        </div>
    );
}