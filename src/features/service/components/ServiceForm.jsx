import {
    useMemo,
    useState,
} from "react";

import Button
    from "../../../shared/components/Button/Button";
    
import { SERVICE_ICONS } from "../../../shared/constants/serviceIcons";



const TITLE_MAX_LENGTH = 150;
const DESCRIPTION_MAX_LENGTH = 5000;
const ICON_MAX_LENGTH = 100;

const EMPTY_FORM = {
    title: "",
    description: "",
    icon: "",
    displayOrder: 0,
    published: false,
};

function createInitialForm(
    service
) {

    if (!service) {

        return {
            ...EMPTY_FORM,
        };
    }

    return {
        title:
            service.title
            ?? "",

        description:
            service.description
            ?? "",

        icon:
            service.icon
            ?? "",

        displayOrder:
            service.displayOrder
            ?? 0,

        published:
            Boolean(
                service.published
            ),
    };
}

function validateForm(
    formData
) {

    const errors = {};

    const title =
        formData.title.trim();

    const description =
        formData.description.trim();

    const icon =
        formData.icon.trim();

    const displayOrder =
        Number(
            formData.displayOrder
        );

    if (!title) {

        errors.title =
            "Title is required.";

    } else if (
        title.length
        > TITLE_MAX_LENGTH
    ) {

        errors.title =
            "Title must not exceed "
            + `${TITLE_MAX_LENGTH} characters.`;
    }

    if (!description) {

        errors.description =
            "Description is required.";

    } else if (
        description.length
        > DESCRIPTION_MAX_LENGTH
    ) {

        errors.description =
            "Description must not exceed "
            + `${DESCRIPTION_MAX_LENGTH} characters.`;
    }

    if (
        icon.length
        > ICON_MAX_LENGTH
    ) {

        errors.icon =
            "Icon must not exceed "
            + `${ICON_MAX_LENGTH} characters.`;
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

function formatIconLabel(
    iconKey
) {

    if (!iconKey) {
        return "";
    }

    return iconKey
        .replace(
            /([A-Z])/g,
            " $1"
        )
        .replace(
            /^./,
            firstCharacter =>
                firstCharacter.toUpperCase()
        );
}

export default function ServiceForm({
    service,
    submitting,
    onSubmit,
    onCancel,
}) {

    const isEditing =
        Boolean(service);

    const [
        formData,
        setFormData,
    ] = useState(
        () => createInitialForm(
            service
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

    const titleLength =
        formData.title.length;

    const descriptionLength =
        formData.description.length;

    const iconLength =
        formData.icon.length;

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
            title: true,
            description: true,
            icon: true,
            displayOrder: true,
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
            title:
                formData.title.trim(),

            description:
                formData.description.trim(),

            icon:
                formData.icon.trim()
                || null,

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
                } service.`
            );
        }
    }

    const titleError =
        getFieldError(
            "title"
        );

    const descriptionError =
        getFieldError(
            "description"
        );

    const iconError =
        getFieldError(
            "icon"
        );

    const displayOrderError =
        getFieldError(
            "displayOrder"
        );

    const SelectedIcon =
    SERVICE_ICONS[
        formData.icon
    ];

    return (
        <form
            className={
                "service-form"
            }
            onSubmit={
                handleSubmit
            }
            noValidate
        >
            <div
                className={
                    "service-form__grid"
                }
            >
                <div
                    className={
                        "service-form__field "
                        + "service-form__field--full"
                    }
                >
                    <div
                        className={
                            "service-form__label-row"
                        }
                    >
                        <label
                            htmlFor="title"
                        >
                            Title

                            <span
                                className={
                                    "service-form__required"
                                }
                                aria-hidden="true"
                            >
                                *
                            </span>
                        </label>

                        <span
                            className={
                                titleLength
                                > TITLE_MAX_LENGTH
                                    ? "service-form__counter service-form__counter--error"
                                    : "service-form__counter"
                            }
                        >
                            {titleLength}
                            /
                            {TITLE_MAX_LENGTH}
                        </span>
                    </div>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        maxLength={
                            TITLE_MAX_LENGTH
                        }
                        value={
                            formData.title
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
                                titleError
                            )
                        }
                        aria-describedby={
                            titleError
                                ? "service-title-error"
                                : undefined
                        }
                    />

                    {
                        titleError && (
                            <span
                                id={
                                    "service-title-error"
                                }
                                className={
                                    "service-form__field-error"
                                }
                            >
                                {titleError}
                            </span>
                        )
                    }
                </div>

                <div
                    className={
                        "service-form__field"
                    }
                >
                    <div
                        className={
                            "service-form__label-row"
                        }
                    >
                        <label
                            htmlFor="icon"
                        >
                            Icon
                        </label>

                        <span
                            className={
                                iconLength
                                > ICON_MAX_LENGTH
                                    ? "service-form__counter service-form__counter--error"
                                    : "service-form__counter"
                            }
                        >
                            {iconLength}
                            /
                            {ICON_MAX_LENGTH}
                        </span>
                    </div>

                    <div
                        className={
                            "service-form__icon-control"
                        }
                    >
                        <select
                            id="icon"
                            name="icon"
                            value={formData.icon}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={submitting}
                            aria-invalid={Boolean(iconError)}
                            aria-describedby={
                                iconError
                                    ? "service-icon-error"
                                    : "service-icon-hint"
                            }
                        >
                            <option value="">
                                Select an icon
                            </option>

                            {
                                Object.keys(
                                    SERVICE_ICONS
                                ).map(
                                    iconKey => (
                                        <option
                                            key={iconKey}
                                            value={iconKey}
                                        >
                                            {
                                                formatIconLabel(
                                                    iconKey
                                                )
                                            }
                                        </option>
                                    )
                                )
                            }
                        </select>

                        <div
                            className={
                                "service-form__icon-preview"
                            }
                            aria-label={
                                formData.icon
                                    ? `Selected icon: ${formatIconLabel(formData.icon)}`
                                    : "No icon selected"
                            }
                        >
                            {
                                SelectedIcon
                                    ? (
                                        <SelectedIcon
                                            size={22}
                                            aria-hidden="true"
                                        />
                                    )
                                    : (
                                        <span>
                                            N/A
                                        </span>
                                    )
                            }
                        </div>
                    </div>

                    {
                        iconError
                            ? (
                                <span
                                    id={
                                        "service-icon-error"
                                    }
                                    className={
                                        "service-form__field-error"
                                    }
                                >
                                    {iconError}
                                </span>
                            )
                            : (
                                <span
                                    id={
                                        "service-icon-hint"
                                    }
                                    className={
                                        "service-form__hint"
                                    }
                                >
                                    Optional icon identifier.
                                </span>
                            )
                    }
                </div>

                <div
                    className={
                        "service-form__field"
                    }
                >
                    <label
                        htmlFor="displayOrder"
                    >
                        Display Order

                        <span
                            className={
                                "service-form__required"
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
                                ? "service-display-order-error"
                                : "service-display-order-hint"
                        }
                    />

                    {
                        displayOrderError
                            ? (
                                <span
                                    id={
                                        "service-display-order-error"
                                    }
                                    className={
                                        "service-form__field-error"
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
                                        "service-display-order-hint"
                                    }
                                    className={
                                        "service-form__hint"
                                    }
                                >
                                    Lower numbers appear first.
                                </span>
                            )
                    }
                </div>

                <div
                    className={
                        "service-form__checkboxes "
                        + "service-form__field--full"
                    }
                >
                    <label
                        className={
                            "service-form__checkbox"
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

                    <span
                        className={
                            "service-form__hint"
                        }
                    >
                        Published services are visible
                        on the public portfolio.
                    </span>
                </div>

                <div
                    className={
                        "service-form__field "
                        + "service-form__field--full"
                    }
                >
                    <div
                        className={
                            "service-form__label-row"
                        }
                    >
                        <label
                            htmlFor="description"
                        >
                            Description

                            <span
                                className={
                                    "service-form__required"
                                }
                                aria-hidden="true"
                            >
                                *
                            </span>
                        </label>

                        <span
                            className={
                                descriptionLength
                                > DESCRIPTION_MAX_LENGTH
                                    ? "service-form__counter service-form__counter--error"
                                    : "service-form__counter"
                            }
                        >
                            {descriptionLength}
                            /
                            {DESCRIPTION_MAX_LENGTH}
                        </span>
                    </div>

                    <textarea
                        id="description"
                        name="description"
                        maxLength={
                            DESCRIPTION_MAX_LENGTH
                        }
                        rows={7}
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
                                ? "service-description-error"
                                : undefined
                        }
                    />

                    {
                        descriptionError && (
                            <span
                                id={
                                    "service-description-error"
                                }
                                className={
                                    "service-form__field-error"
                                }
                            >
                                {descriptionError}
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
                            + "service-form__error"
                        }
                        role="alert"
                    >
                        {submitError}
                    </div>
                )
            }

            <div
                className={
                    "service-form__actions"
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
                            ? "Update Service"
                            : "Create Service"
                    }
                </Button>
            </div>
        </form>
    );
}