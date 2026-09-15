import {
    useMemo,
    useState,
} from "react";

import Button
    from "../../../shared/components/Button/Button";

const DESCRIPTION_MAX_LENGTH = 5000;

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

function validateForm(
    formData
) {

    const errors = {};

    const company =
        formData.company.trim();

    const position =
        formData.position.trim();

    const description =
        formData.description.trim();

    const displayOrder =
        Number(
            formData.displayOrder
        );

    if (!company) {

        errors.company =
            "Company is required.";

    } else if (company.length > 255) {

        errors.company =
            "Company must not exceed 255 characters.";
    }

    if (!position) {

        errors.position =
            "Position is required.";

    } else if (position.length > 255) {

        errors.position =
            "Position must not exceed 255 characters.";
    }

    if (
        description.length
        > DESCRIPTION_MAX_LENGTH
    ) {

        errors.description =
            "Description must not exceed "
            + `${DESCRIPTION_MAX_LENGTH} characters.`;
    }

    if (!formData.startDate) {

        errors.startDate =
            "Start date is required.";
    }

    if (
        !formData.currentlyWorking
        && formData.endDate
        && formData.startDate
        && formData.endDate
        < formData.startDate
    ) {

        errors.endDate =
            "End date cannot be earlier "
            + "than start date.";
    }

    if (
        formData.displayOrder === ""
        || !Number.isInteger(
            displayOrder
        )
        || displayOrder < 0
    ) {

        errors.displayOrder =
            "Display order must be "
            + "a whole number of zero or greater.";
    }

    return errors;
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
        touched,
        setTouched,
    ] = useState({});

    const [
        submitError,
        setSubmitError,
    ] = useState("");

    const validationErrors =
        useMemo(
            () => validateForm(
                formData
            ),
            [
                formData,
            ]
        );

    const descriptionLength =
        formData.description.length;

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

        if (submitError) {
            setSubmitError("");
        }
    }

    function handleBlur(event) {

        const {
            name,
        } = event.target;

        setTouched(
            previousTouched => ({
                ...previousTouched,
                [name]: true,
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

        setTouched(
            previousTouched => ({
                ...previousTouched,
                currentlyWorking: true,
                endDate: checked
                    ? false
                    : previousTouched.endDate,
            })
        );
    }

    function getFieldError(
        fieldName
    ) {

        if (!touched[fieldName]) {
            return "";
        }

        return validationErrors[
            fieldName
        ] ?? "";
    }

    function markAllFieldsTouched() {

        setTouched({
            company: true,
            position: true,
            description: true,
            startDate: true,
            endDate: true,
            displayOrder: true,
            currentlyWorking: true,
            published: true,
        });
    }

    async function handleSubmit(
        event
    ) {

        event.preventDefault();

        setSubmitError("");

        if (
            Object.keys(
                validationErrors
            ).length > 0
        ) {

            markAllFieldsTouched();

            setSubmitError(
                "Please correct the highlighted fields."
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

            displayOrder:
                Number(
                    formData.displayOrder
                ),

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

            setSubmitError(
                backendMessage
                || `Unable to ${
                    isEditing
                        ? "update"
                        : "create"
                } experience.`
            );
        }
    }

    const companyError =
        getFieldError(
            "company"
        );

    const positionError =
        getFieldError(
            "position"
        );

    const startDateError =
        getFieldError(
            "startDate"
        );

    const endDateError =
        getFieldError(
            "endDate"
        );

    const displayOrderError =
        getFieldError(
            "displayOrder"
        );

    const descriptionError =
        getFieldError(
            "description"
        );

    return (
        <form
            className={
                "experience-form"
            }
            onSubmit={
                handleSubmit
            }
            noValidate
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
                        <span
                            className={
                                "experience-form__required"
                            }
                            aria-hidden="true"
                        >
                            *
                        </span>
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
                        onBlur={
                            handleBlur
                        }
                        disabled={
                            submitting
                        }
                        aria-invalid={
                            Boolean(
                                companyError
                            )
                        }
                        aria-describedby={
                            companyError
                                ? "company-error"
                                : undefined
                        }
                        autoComplete={
                            "organization"
                        }
                    />

                    {
                        companyError && (
                            <span
                                id="company-error"
                                className={
                                    "experience-form__field-error"
                                }
                            >
                                {companyError}
                            </span>
                        )
                    }
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
                        <span
                            className={
                                "experience-form__required"
                            }
                            aria-hidden="true"
                        >
                            *
                        </span>
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
                        onBlur={
                            handleBlur
                        }
                        disabled={
                            submitting
                        }
                        aria-invalid={
                            Boolean(
                                positionError
                            )
                        }
                        aria-describedby={
                            positionError
                                ? "position-error"
                                : undefined
                        }
                        autoComplete={
                            "organization-title"
                        }
                    />

                    {
                        positionError && (
                            <span
                                id="position-error"
                                className={
                                    "experience-form__field-error"
                                }
                            >
                                {positionError}
                            </span>
                        )
                    }
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
                        <span
                            className={
                                "experience-form__required"
                            }
                            aria-hidden="true"
                        >
                            *
                        </span>
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
                        onBlur={
                            handleBlur
                        }
                        disabled={
                            submitting
                        }
                        aria-invalid={
                            Boolean(
                                startDateError
                            )
                        }
                        aria-describedby={
                            startDateError
                                ? "start-date-error"
                                : undefined
                        }
                    />

                    {
                        startDateError && (
                            <span
                                id="start-date-error"
                                className={
                                    "experience-form__field-error"
                                }
                            >
                                {startDateError}
                            </span>
                        )
                    }
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
                        onBlur={
                            handleBlur
                        }
                        disabled={
                            submitting
                            || formData
                                .currentlyWorking
                        }
                        aria-invalid={
                            Boolean(
                                endDateError
                            )
                        }
                        aria-describedby={
                            endDateError
                                ? "end-date-error"
                                : undefined
                        }
                    />

                    {
                        endDateError && (
                            <span
                                id="end-date-error"
                                className={
                                    "experience-form__field-error"
                                }
                            >
                                {endDateError}
                            </span>
                        )
                    }

                    {
                        formData.currentlyWorking
                        && (
                            <span
                                className={
                                    "experience-form__hint"
                                }
                            >
                                End date is disabled
                                while currently working.
                            </span>
                        )
                    }
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
                        <span
                            className={
                                "experience-form__required"
                            }
                            aria-hidden="true"
                        >
                            *
                        </span>
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
                        onBlur={
                            handleBlur
                        }
                        disabled={
                            submitting
                        }
                        aria-invalid={
                            Boolean(
                                displayOrderError
                            )
                        }
                        aria-describedby={
                            displayOrderError
                                ? "display-order-error"
                                : "display-order-hint"
                        }
                    />

                    {
                        displayOrderError
                            ? (
                                <span
                                    id={
                                        "display-order-error"
                                    }
                                    className={
                                        "experience-form__field-error"
                                    }
                                >
                                    {
                                        displayOrderError
                                    }
                                </span>
                            )
                            : (
                                <span
                                    id={
                                        "display-order-hint"
                                    }
                                    className={
                                        "experience-form__hint"
                                    }
                                >
                                    Lower numbers appear first.
                                </span>
                            )
                    }
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
                    <div
                        className={
                            "experience-form__label-row"
                        }
                    >
                        <label
                            htmlFor={
                                "description"
                            }
                        >
                            Description
                        </label>

                        <span
                            className={
                                descriptionLength
                                > DESCRIPTION_MAX_LENGTH
                                    ? "experience-form__counter experience-form__counter--error"
                                    : "experience-form__counter"
                            }
                        >
                            {
                                descriptionLength
                            }
                            /
                            {
                                DESCRIPTION_MAX_LENGTH
                            }
                        </span>
                    </div>

                    <textarea
                        id="description"
                        name="description"
                        maxLength={
                            DESCRIPTION_MAX_LENGTH
                        }
                        rows={6}
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        onBlur={
                            handleBlur
                        }
                        disabled={
                            submitting
                        }
                        aria-invalid={
                            Boolean(
                                descriptionError
                            )
                        }
                        aria-describedby={
                            descriptionError
                                ? "description-error"
                                : undefined
                        }
                    />

                    {
                        descriptionError && (
                            <span
                                id={
                                    "description-error"
                                }
                                className={
                                    "experience-form__field-error"
                                }
                            >
                                {
                                    descriptionError
                                }
                            </span>
                        )
                    }
                </div>
            </div>

            {
                submitError && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "experience-form__error"
                        }
                        role="alert"
                    >
                        {submitError}
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
                    loadingLabel={
                        "Saving..."
                    }
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