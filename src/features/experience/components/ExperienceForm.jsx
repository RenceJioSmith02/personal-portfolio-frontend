import {
    useState,
} from "react";

import Button
    from "../../../shared/components/Button/Button";

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
        return {
            ...EMPTY_FORM,
        };
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
                        disabled={
                            submitting
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
                        disabled={
                            submitting
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
                        disabled={
                            submitting
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
                            submitting
                            || formData
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
                        disabled={
                            submitting
                        }
                        required
                    />
                </div>

                <div
                    className={
                        "experience-form__checkboxes"
                    }
                >
                    <label
                        className={
                            "experience-form__checkbox"
                        }
                    >
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
                            disabled={
                                submitting
                            }
                        />

                        <span>
                            Currently working
                        </span>
                    </label>

                    <label
                        className={
                            "experience-form__checkbox"
                        }
                    >
                        <input
                            name="published"
                            type="checkbox"
                            checked={
                                formData.published
                            }
                            onChange={
                                handleChange
                            }
                            disabled={
                                submitting
                            }
                        />

                        <span>
                            Published
                        </span>
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
                        disabled={
                            submitting
                        }
                    />
                </div>
            </div>

            {
                error && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "experience-form__error"
                        }
                        role="alert"
                    >
                        {error}
                    </div>
                )
            }

            <div
                className={
                    "experience-form__actions"
                }
            >
                <Button
                    type="button"
                    variant="secondary"
                    onClick={
                        onCancel
                    }
                    disabled={
                        submitting
                    }
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    loading={
                        submitting
                    }
                    loadingLabel="Saving..."
                >
                    {
                        isEditing
                            ? "Update Experience"
                            : "Create Experience"
                    }
                </Button>
            </div>
        </form>
    );
}