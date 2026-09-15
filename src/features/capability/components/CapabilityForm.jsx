import {
    useMemo,
    useState,
} from "react";

import Button
    from "../../../shared/components/Button/Button";

import {
    SERVICE_ICONS,
} from "../../../shared/constants/serviceIcons";

const NAME_MAX_LENGTH = 150;
const CATEGORY_MAX_LENGTH = 100;
const PROFICIENCY_MAX_LENGTH = 50;
const ICON_MAX_LENGTH = 100;

const CATEGORY_OPTIONS = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Cloud",
    "Testing",
    "Tools",
    "Mobile",
    "Architecture",
    "Security",
    "Data",
    "Artificial Intelligence",
    "Soft Skills",
];

const PROFICIENCY_OPTIONS = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
];

const EMPTY_FORM = {
    name: "",
    category: "",
    proficiencyLevel: "",
    icon: "",
    displayOrder: 0,
    published: false,
};

function createInitialForm(
    capability
) {

    if (!capability) {

        return {
            ...EMPTY_FORM,
        };
    }

    return {
        name:
            capability.name
            ?? "",

        category:
            capability.category
            ?? "",

        proficiencyLevel:
            capability.proficiencyLevel
            ?? "",

        icon:
            capability.icon
            ?? "",

        displayOrder:
            capability.displayOrder
            ?? 0,

        published:
            Boolean(
                capability.published
            ),
    };
}

function validateForm(
    formData
) {

    const errors = {};

    const name =
        formData.name.trim();

    const category =
        formData.category.trim();

    const proficiencyLevel =
        formData.proficiencyLevel.trim();

    const icon =
        formData.icon.trim();

    const displayOrder =
        Number(
            formData.displayOrder
        );

    if (!name) {

        errors.name =
            "Name is required.";

    } else if (
        name.length
        > NAME_MAX_LENGTH
    ) {

        errors.name =
            "Name must not exceed "
            + `${NAME_MAX_LENGTH} characters.`;
    }

    if (!category) {

        errors.category =
            "Category is required.";

    } else if (
        category.length
        > CATEGORY_MAX_LENGTH
    ) {

        errors.category =
            "Category must not exceed "
            + `${CATEGORY_MAX_LENGTH} characters.`;
    }

    if (!proficiencyLevel) {

        errors.proficiencyLevel =
            "Proficiency level is required.";

    } else if (
        proficiencyLevel.length
        > PROFICIENCY_MAX_LENGTH
    ) {

        errors.proficiencyLevel =
            "Proficiency level must not exceed "
            + `${PROFICIENCY_MAX_LENGTH} characters.`;
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

export default function CapabilityForm({
    capability,
    submitting,
    onSubmit,
    onCancel,
}) {

    const isEditing =
        Boolean(capability);

    const [
        formData,
        setFormData,
    ] = useState(
        () => createInitialForm(
            capability
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

    const nameLength =
        formData.name.length;

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
            name: true,
            category: true,
            proficiencyLevel: true,
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
            name:
                formData.name.trim(),

            category:
                formData.category.trim(),

            proficiencyLevel:
                formData.proficiencyLevel.trim(),

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
                } capability.`
            );
        }
    }

    const nameError =
        getFieldError(
            "name"
        );

    const categoryError =
        getFieldError(
            "category"
        );

    const proficiencyError =
        getFieldError(
            "proficiencyLevel"
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
                "capability-form"
            }
            onSubmit={
                handleSubmit
            }
            noValidate
        >
            <div
                className={
                    "capability-form__grid"
                }
            >
                <div
                    className={
                        "capability-form__field "
                        + "capability-form__field--full"
                    }
                >
                    <div
                        className={
                            "capability-form__label-row"
                        }
                    >
                        <label
                            htmlFor="name"
                        >
                            Name

                            <span
                                className={
                                    "capability-form__required"
                                }
                                aria-hidden="true"
                            >
                                *
                            </span>
                        </label>

                        <span
                            className={
                                "capability-form__counter"
                            }
                        >
                            {nameLength}
                            /
                            {NAME_MAX_LENGTH}
                        </span>
                    </div>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        maxLength={
                            NAME_MAX_LENGTH
                        }
                        value={
                            formData.name
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
                        placeholder={
                            "Example: Spring Boot"
                        }
                        aria-invalid={
                            Boolean(
                                nameError
                            )
                        }
                        aria-describedby={
                            nameError
                                ? "capability-name-error"
                                : undefined
                        }
                    />

                    {
                        nameError && (
                            <span
                                id={
                                    "capability-name-error"
                                }
                                className={
                                    "capability-form__field-error"
                                }
                            >
                                {nameError}
                            </span>
                        )
                    }
                </div>

                <div
                    className={
                        "capability-form__field"
                    }
                >
                    <label
                        htmlFor="category"
                    >
                        Category

                        <span
                            className={
                                "capability-form__required"
                            }
                            aria-hidden="true"
                        >
                            *
                        </span>
                    </label>

                    <select
                        id="category"
                        name="category"
                        value={
                            formData.category
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
                                categoryError
                            )
                        }
                        aria-describedby={
                            categoryError
                                ? "capability-category-error"
                                : undefined
                        }
                    >
                        <option value="">
                            Select a category
                        </option>

                        {
                            CATEGORY_OPTIONS.map(
                                category => (
                                    <option
                                        key={
                                            category
                                        }
                                        value={
                                            category
                                        }
                                    >
                                        {category}
                                    </option>
                                )
                            )
                        }
                    </select>

                    {
                        categoryError && (
                            <span
                                id={
                                    "capability-category-error"
                                }
                                className={
                                    "capability-form__field-error"
                                }
                            >
                                {categoryError}
                            </span>
                        )
                    }
                </div>

                <div
                    className={
                        "capability-form__field"
                    }
                >
                    <label
                        htmlFor={
                            "proficiencyLevel"
                        }
                    >
                        Proficiency Level

                        <span
                            className={
                                "capability-form__required"
                            }
                            aria-hidden="true"
                        >
                            *
                        </span>
                    </label>

                    <select
                        id={
                            "proficiencyLevel"
                        }
                        name={
                            "proficiencyLevel"
                        }
                        value={
                            formData.proficiencyLevel
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
                                proficiencyError
                            )
                        }
                        aria-describedby={
                            proficiencyError
                                ? "capability-proficiency-error"
                                : undefined
                        }
                    >
                        <option value="">
                            Select a proficiency level
                        </option>

                        {
                            PROFICIENCY_OPTIONS.map(
                                level => (
                                    <option
                                        key={
                                            level
                                        }
                                        value={
                                            level
                                        }
                                    >
                                        {level}
                                    </option>
                                )
                            )
                        }
                    </select>

                    {
                        proficiencyError && (
                            <span
                                id={
                                    "capability-proficiency-error"
                                }
                                className={
                                    "capability-form__field-error"
                                }
                            >
                                {proficiencyError}
                            </span>
                        )
                    }
                </div>

                <div
                    className={
                        "capability-form__field"
                    }
                >
                    <label
                        htmlFor="icon"
                    >
                        Icon
                    </label>

                    <div
                        className={
                            "capability-form__icon-control"
                        }
                    >
                        <select
                            id="icon"
                            name="icon"
                            value={
                                formData.icon
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
                                    iconError
                                )
                            }
                            aria-describedby={
                                iconError
                                    ? "capability-icon-error"
                                    : "capability-icon-hint"
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
                                            key={
                                                iconKey
                                            }
                                            value={
                                                iconKey
                                            }
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
                                "capability-form__icon-preview"
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
                                        "capability-icon-error"
                                    }
                                    className={
                                        "capability-form__field-error"
                                    }
                                >
                                    {iconError}
                                </span>
                            )
                            : (
                                <span
                                    id={
                                        "capability-icon-hint"
                                    }
                                    className={
                                        "capability-form__hint"
                                    }
                                >
                                    Optional. The icon key
                                    is stored in the database.
                                </span>
                            )
                    }
                </div>

                <div
                    className={
                        "capability-form__field"
                    }
                >
                    <label
                        htmlFor="displayOrder"
                    >
                        Display Order

                        <span
                            className={
                                "capability-form__required"
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
                                ? "capability-display-order-error"
                                : "capability-display-order-hint"
                        }
                    />

                    {
                        displayOrderError
                            ? (
                                <span
                                    id={
                                        "capability-display-order-error"
                                    }
                                    className={
                                        "capability-form__field-error"
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
                                        "capability-display-order-hint"
                                    }
                                    className={
                                        "capability-form__hint"
                                    }
                                >
                                    Lower numbers appear first.
                                </span>
                            )
                    }
                </div>

                <div
                    className={
                        "capability-form__checkboxes "
                        + "capability-form__field--full"
                    }
                >
                    <label
                        className={
                            "capability-form__checkbox"
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
                            "capability-form__hint"
                        }
                    >
                        Published capabilities are
                        visible on the public portfolio.
                    </span>
                </div>
            </div>

            {
                submitError && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "capability-form__error"
                        }
                        role="alert"
                    >
                        {submitError}
                    </div>
                )
            }

            <div
                className={
                    "capability-form__actions"
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
                            ? "Update Capability"
                            : "Create Capability"
                    }
                </Button>
            </div>
        </form>
    );
}