import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import Button
    from "../../../shared/components/Button/Button";

import {
    deleteProjectFile,
    uploadProjectImage,
} from "../services/projectFileService";

import {
    resolveProjectImageUrl,
} from "../utils/projectImageUtils";

const TITLE_MAX_LENGTH = 200;
const SLUG_MAX_LENGTH = 200;
const SUMMARY_MAX_LENGTH = 500;
const DESCRIPTION_MAX_LENGTH = 10000;
const URL_MAX_LENGTH = 500;
const TECH_STACK_MAX_LENGTH = 1000;

const MAX_IMAGE_SIZE =
    5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const SLUG_PATTERN =
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const HTTP_URL_PATTERN =
    /^https?:\/\/[^\s]+$/i;

const EMPTY_FORM = {
    title: "",
    slug: "",
    summary: "",
    description: "",
    imageUrl: "",
    imageStorageKey: "",
    repositoryUrl: "",
    liveUrl: "",
    techStack: "",
    displayOrder: 0,
    published: false,
};

function createInitialForm(
    project
) {

    if (!project) {
        return {
            ...EMPTY_FORM,
        };
    }

    return {
        title:
            project.title
            ?? "",

        slug:
            project.slug
            ?? "",

        summary:
            project.summary
            ?? "",

        description:
            project.description
            ?? "",

        imageUrl:
            project.imageUrl
            ?? "",

        imageStorageKey:
            project.imageStorageKey
            ?? "",

        repositoryUrl:
            project.repositoryUrl
            ?? "",

        liveUrl:
            project.liveUrl
            ?? "",

        techStack:
            project.techStack
            ?? "",

        displayOrder:
            project.displayOrder
            ?? 0,

        published:
            Boolean(
                project.published
            ),
    };
}

function generateSlug(
    value
) {

    return value
        .trim()
        .toLowerCase()
        .normalize("NFKD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /-{2,}/g,
            "-"
        )
        .replace(
            /^-|-$/g,
            ""
        )
        .slice(
            0,
            SLUG_MAX_LENGTH
        );
}

function normalizeSlugInput(
    value
) {

    return value
        .toLowerCase()
        .replace(
            /[^a-z0-9-]/g,
            "-"
        )
        .replace(
            /-{2,}/g,
            "-"
        )
        .replace(
            /^-/,
            ""
        )
        .slice(
            0,
            SLUG_MAX_LENGTH
        );
}

function isValidHttpUrl(
    value
) {

    if (!value) {
        return true;
    }

    if (
        !HTTP_URL_PATTERN.test(
            value
        )
    ) {
        return false;
    }

    try {

        const parsedUrl =
            new URL(value);

        return (
            parsedUrl.protocol === "http:"
            || parsedUrl.protocol === "https:"
        );

    } catch {

        return false;
    }
}

function validateImageFile(
    file
) {

    if (!file) {
        return "";
    }

    if (
        !ALLOWED_IMAGE_TYPES.includes(
            file.type
        )
    ) {
        return (
            "Only JPEG, PNG, and WEBP "
            + "images are allowed."
        );
    }

    if (
        file.size > MAX_IMAGE_SIZE
    ) {
        return (
            "Image size must not exceed "
            + "5 MB."
        );
    }

    return "";
}

function validateForm(
    formData,
    selectedImage
) {

    const errors = {};

    const title =
        formData.title.trim();

    const slug =
        formData.slug.trim();

    const summary =
        formData.summary.trim();

    const description =
        formData.description.trim();

    const repositoryUrl =
        formData.repositoryUrl.trim();

    const liveUrl =
        formData.liveUrl.trim();

    const techStack =
        formData.techStack.trim();

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

    if (!slug) {

        errors.slug =
            "Slug is required.";

    } else if (
        slug.length
        > SLUG_MAX_LENGTH
    ) {

        errors.slug =
            "Slug must not exceed "
            + `${SLUG_MAX_LENGTH} characters.`;

    } else if (
        !SLUG_PATTERN.test(
            slug
        )
    ) {

        errors.slug =
            "Slug must contain only "
            + "lowercase letters, numbers, "
            + "and single hyphens.";
    }

    if (!summary) {

        errors.summary =
            "Summary is required.";

    } else if (
        summary.length
        > SUMMARY_MAX_LENGTH
    ) {

        errors.summary =
            "Summary must not exceed "
            + `${SUMMARY_MAX_LENGTH} characters.`;
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
        repositoryUrl.length
        > URL_MAX_LENGTH
    ) {

        errors.repositoryUrl =
            "Repository URL must not exceed "
            + `${URL_MAX_LENGTH} characters.`;

    } else if (
        repositoryUrl
        && !isValidHttpUrl(
            repositoryUrl
        )
    ) {

        errors.repositoryUrl =
            "Repository URL must be a valid "
            + "HTTP or HTTPS URL.";
    }

    if (
        liveUrl.length
        > URL_MAX_LENGTH
    ) {

        errors.liveUrl =
            "Live URL must not exceed "
            + `${URL_MAX_LENGTH} characters.`;

    } else if (
        liveUrl
        && !isValidHttpUrl(
            liveUrl
        )
    ) {

        errors.liveUrl =
            "Live URL must be a valid "
            + "HTTP or HTTPS URL.";
    }

    if (
        techStack.length
        > TECH_STACK_MAX_LENGTH
    ) {

        errors.techStack =
            "Tech stack must not exceed "
            + `${TECH_STACK_MAX_LENGTH} characters.`;
    }

    if (
        formData.displayOrder === ""
        || !Number.isInteger(
            displayOrder
        )
        || displayOrder < 0
    ) {

        errors.displayOrder =
            "Display order must be a whole "
            + "number of zero or greater.";
    }

    const imageError =
        validateImageFile(
            selectedImage
        );

    if (imageError) {
        errors.image =
            imageError;
    }

    return errors;
}

function getBackendErrorMessage(
    exception,
    fallbackMessage
) {

    const responseData =
        exception.response
            ?.data;

    if (
        typeof responseData?.message
        === "string"
    ) {
        return responseData.message;
    }

    if (
        typeof responseData?.error
        === "string"
    ) {
        return responseData.error;
    }

    if (
        typeof exception.message
        === "string"
        && exception.message
    ) {
        return exception.message;
    }

    return fallbackMessage;
}

function CharacterCounter({
    currentLength,
    maximumLength,
}) {

    const isOverLimit =
        currentLength
        > maximumLength;

    const className = [
        "project-form__counter",
        isOverLimit
            ? "project-form__counter--error"
            : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <span className={className}>
            {currentLength}
            /
            {maximumLength}
        </span>
    );
}

function FieldError({
    id,
    message,
}) {

    if (!message) {
        return null;
    }

    return (
        <span
            id={id}
            className={
                "project-form__field-error"
            }
            role="alert"
        >
            {message}
        </span>
    );
}

export default function ProjectForm({
    project,
    submitting = false,
    onSubmit,
    onCancel,
}) {

    const isEditing =
        Boolean(project);

    const fileInputRef =
        useRef(null);

    const [
        formData,
        setFormData,
    ] = useState(
        () => createInitialForm(
            project
        )
    );

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null);

    const [
        localPreviewUrl,
        setLocalPreviewUrl,
    ] = useState("");

    const [
        imagePreviewFailed,
        setImagePreviewFailed,
    ] = useState(false);

    const [
        imageSelectionError,
        setImageSelectionError,
    ] = useState("");

    const [
        slugManuallyEdited,
        setSlugManuallyEdited,
    ] = useState(
        Boolean(
            project?.slug
        )
    );

    const [
        touched,
        setTouched,
    ] = useState({});

    const [
        uploading,
        setUploading,
    ] = useState(false);

    const [
        submitError,
        setSubmitError,
    ] = useState("");

    const busy =
        submitting
        || uploading;

    useEffect(() => {

        if (!selectedImage) {
            setLocalPreviewUrl("");

            return undefined;
        }

        const objectUrl =
            URL.createObjectURL(
                selectedImage
            );

        setLocalPreviewUrl(
            objectUrl
        );

        setImagePreviewFailed(false);

        return () => {
            URL.revokeObjectURL(
                objectUrl
            );
        };

    }, [
        selectedImage,
    ]);

    const validationErrors =
        useMemo(
            () => validateForm(
                formData,
                selectedImage
            ),
            [
                formData,
                selectedImage,
            ]
        );

    const existingImageUrl =
        resolveProjectImageUrl(
            formData.imageUrl
        );

    const imagePreviewUrl =
        localPreviewUrl
        || existingImageUrl;

    function getFieldError(
        fieldName
    ) {

        if (!touched[fieldName]) {
            return "";
        }

        return validationErrors[
            fieldName
        ] || "";
    }

    const titleError =
        getFieldError(
            "title"
        );

    const slugError =
        getFieldError(
            "slug"
        );

    const summaryError =
        getFieldError(
            "summary"
        );

    const descriptionError =
        getFieldError(
            "description"
        );

    const repositoryUrlError =
        getFieldError(
            "repositoryUrl"
        );

    const liveUrlError =
        getFieldError(
            "liveUrl"
        );

    const techStackError =
        getFieldError(
            "techStack"
        );

    const displayOrderError =
        getFieldError(
            "displayOrder"
        );

    const imageError =
        touched.image
            ? (
                imageSelectionError
                || validationErrors.image
                || ""
            )
            : "";

    function clearSubmitError() {

        if (submitError) {
            setSubmitError("");
        }
    }

    function handleChange(
        event
    ) {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        const nextValue =
            type === "checkbox"
                ? checked
                : value;

        setFormData(
            previousFormData => {

                const updatedFormData = {
                    ...previousFormData,
                    [name]: nextValue,
                };

                if (
                    name === "title"
                    && !slugManuallyEdited
                ) {
                    updatedFormData.slug =
                        generateSlug(
                            value
                        );
                }

                return updatedFormData;
            }
        );

        clearSubmitError();
    }

    function handleSlugChange(
        event
    ) {

        const normalizedSlug =
            normalizeSlugInput(
                event.target.value
            );

        setSlugManuallyEdited(true);

        setFormData(
            previousFormData => ({
                ...previousFormData,
                slug: normalizedSlug,
            })
        );

        clearSubmitError();
    }

    function handleBlur(
        event
    ) {

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

    function handleSlugBlur() {

        setFormData(
            previousFormData => ({
                ...previousFormData,
                slug:
                    previousFormData.slug
                        .replace(
                            /-+$/g,
                            ""
                        ),
            })
        );

        setTouched(
            previousTouched => ({
                ...previousTouched,
                slug: true,
            })
        );
    }

    function handleImageChange(
        event
    ) {

        const file =
            event.target.files?.[0]
            || null;

        setTouched(
            previousTouched => ({
                ...previousTouched,
                image: true,
            })
        );

        setImageSelectionError("");
        setImagePreviewFailed(false);

        if (!file) {
            setSelectedImage(null);

            return;
        }

        const fileError =
            validateImageFile(
                file
            );

        if (fileError) {

            setSelectedImage(null);

            setImageSelectionError(
                fileError
            );

            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value =
                    "";
            }

            return;
        }

        setSelectedImage(file);

        clearSubmitError();
    }

    function clearSelectedImage() {

        setSelectedImage(null);
        setImageSelectionError("");
        setImagePreviewFailed(false);

        setTouched(
            previousTouched => ({
                ...previousTouched,
                image: false,
            })
        );

        if (
            fileInputRef.current
        ) {
            fileInputRef.current.value =
                "";
        }
    }

    function regenerateSlug() {

        const generatedSlug =
            generateSlug(
                formData.title
            );

        setSlugManuallyEdited(false);

        setFormData(
            previousFormData => ({
                ...previousFormData,
                slug: generatedSlug,
            })
        );

        setTouched(
            previousTouched => ({
                ...previousTouched,
                slug: true,
            })
        );

        clearSubmitError();
    }

    function markAllFieldsTouched() {

        setTouched({
            title: true,
            slug: true,
            summary: true,
            description: true,
            image: true,
            repositoryUrl: true,
            liveUrl: true,
            techStack: true,
            displayOrder: true,
            published: true,
        });
    }

    async function cleanupUploadedFile(
        uploadedFile
    ) {

        if (!uploadedFile?.storageKey) {
            return;
        }

        try {

            await deleteProjectFile(
                uploadedFile.storageKey
            );

        } catch {
            // Cleanup is best-effort only.
        }
    }

    async function handleSubmit(
        event
    ) {

        event.preventDefault();

        setSubmitError("");

        const hasValidationErrors =
            Object.keys(
                validationErrors
            ).length > 0;

        if (
            hasValidationErrors
            || imageSelectionError
        ) {

            markAllFieldsTouched();

            setSubmitError(
                "Please correct the highlighted fields."
            );

            return;
        }

        let uploadedFile = null;

        try {

            let imageUrl =
                formData.imageUrl.trim()
                || null;

            let imageStorageKey =
                formData.imageStorageKey.trim()
                || null;

            if (selectedImage) {

                setUploading(true);

                uploadedFile =
                    await uploadProjectImage(
                        selectedImage
                    );

                if (
                    !uploadedFile?.fileUrl
                    || !uploadedFile?.storageKey
                ) {

                    throw new Error(
                        "The upload response did not "
                        + "contain the required image data."
                    );
                }

                imageUrl =
                    uploadedFile.fileUrl;

                imageStorageKey =
                    uploadedFile.storageKey;
            }

            const payload = {
                title:
                    formData.title.trim(),

                slug:
                    formData.slug.trim(),

                summary:
                    formData.summary.trim(),

                description:
                    formData.description.trim(),

                imageUrl,

                imageStorageKey,

                repositoryUrl:
                    formData.repositoryUrl
                        .trim()
                    || null,

                liveUrl:
                    formData.liveUrl
                        .trim()
                    || null,

                techStack:
                    formData.techStack
                        .trim()
                    || null,

                displayOrder:
                    Number(
                        formData.displayOrder
                    ),

                published:
                    formData.published,
            };

            await onSubmit(payload);

        } catch (exception) {

            if (uploadedFile) {
                await cleanupUploadedFile(
                    uploadedFile
                );
            }

            const message =
                getBackendErrorMessage(
                    exception,
                    isEditing
                        ? "Unable to update project."
                        : "Unable to create project."
                );

            setSubmitError(message);

        } finally {

            setUploading(false);
        }
    }

    return (
        <form
            className="project-form"
            onSubmit={handleSubmit}
            noValidate
        >
            <section
                className={
                    "project-form__section"
                }
            >
                <header
                    className={
                        "project-form__section-header"
                    }
                >
                    <h3>
                        Basic Information
                    </h3>

                    <p>
                        Provide the project title,
                        public slug, display order,
                        and publishing status.
                    </p>
                </header>

                <div
                    className={
                        "project-form__grid"
                    }
                >
                    <div
                        className={
                            "project-form__field "
                            + "project-form__field--full"
                        }
                    >
                        <div
                            className={
                                "project-form__label-row"
                            }
                        >
                            <label
                                htmlFor="project-title"
                            >
                                Title

                                <span
                                    className={
                                        "project-form__required"
                                    }
                                    aria-hidden="true"
                                >
                                    *
                                </span>
                            </label>

                            <CharacterCounter
                                currentLength={
                                    formData.title.length
                                }
                                maximumLength={
                                    TITLE_MAX_LENGTH
                                }
                            />
                        </div>

                        <input
                            id="project-title"
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
                            disabled={busy}
                            placeholder={
                                "Example: Portfolio CMS"
                            }
                            aria-invalid={
                                Boolean(
                                    titleError
                                )
                            }
                            aria-describedby={
                                titleError
                                    ? "project-title-error"
                                    : undefined
                            }
                        />

                        <FieldError
                            id="project-title-error"
                            message={titleError}
                        />
                    </div>

                    <div
                        className={
                            "project-form__field "
                            + "project-form__field--full"
                        }
                    >
                        <div
                            className={
                                "project-form__label-row"
                            }
                        >
                            <label
                                htmlFor="project-slug"
                            >
                                Slug

                                <span
                                    className={
                                        "project-form__required"
                                    }
                                    aria-hidden="true"
                                >
                                    *
                                </span>
                            </label>

                            <CharacterCounter
                                currentLength={
                                    formData.slug.length
                                }
                                maximumLength={
                                    SLUG_MAX_LENGTH
                                }
                            />
                        </div>

                        <div
                            className={
                                "project-form__slug-control"
                            }
                        >
                            <input
                                id="project-slug"
                                name="slug"
                                type="text"
                                maxLength={
                                    SLUG_MAX_LENGTH
                                }
                                value={
                                    formData.slug
                                }
                                onChange={
                                    handleSlugChange
                                }
                                onBlur={
                                    handleSlugBlur
                                }
                                disabled={busy}
                                placeholder={
                                    "portfolio-cms"
                                }
                                aria-invalid={
                                    Boolean(
                                        slugError
                                    )
                                }
                                aria-describedby={
                                    slugError
                                        ? "project-slug-error"
                                        : "project-slug-hint"
                                }
                            />

                            <Button
                                type="button"
                                variant="secondary"
                                size="small"
                                onClick={
                                    regenerateSlug
                                }
                                disabled={
                                    busy
                                    || !formData
                                        .title
                                        .trim()
                                }
                            >
                                Generate
                            </Button>
                        </div>

                        {
                            slugError
                                ? (
                                    <FieldError
                                        id={
                                            "project-slug-error"
                                        }
                                        message={
                                            slugError
                                        }
                                    />
                                )
                                : (
                                    <span
                                        id={
                                            "project-slug-hint"
                                        }
                                        className={
                                            "project-form__hint"
                                        }
                                    >
                                        Lowercase letters,
                                        numbers, and single
                                        hyphens only.
                                    </span>
                                )
                        }
                    </div>

                    <div
                        className={
                            "project-form__field"
                        }
                    >
                        <label
                            htmlFor={
                                "project-display-order"
                            }
                        >
                            Display Order

                            <span
                                className={
                                    "project-form__required"
                                }
                                aria-hidden="true"
                            >
                                *
                            </span>
                        </label>

                        <input
                            id={
                                "project-display-order"
                            }
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
                            disabled={busy}
                            aria-invalid={
                                Boolean(
                                    displayOrderError
                                )
                            }
                            aria-describedby={
                                displayOrderError
                                    ? "project-display-order-error"
                                    : "project-display-order-hint"
                            }
                        />

                        {
                            displayOrderError
                                ? (
                                    <FieldError
                                        id={
                                            "project-display-order-error"
                                        }
                                        message={
                                            displayOrderError
                                        }
                                    />
                                )
                                : (
                                    <span
                                        id={
                                            "project-display-order-hint"
                                        }
                                        className={
                                            "project-form__hint"
                                        }
                                    >
                                        Lower numbers appear
                                        first.
                                    </span>
                                )
                        }
                    </div>

                    <div
                        className={
                            "project-form__checkbox-panel"
                        }
                    >
                        <label
                            className={
                                "project-form__checkbox"
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
                                disabled={busy}
                            />

                            <span>
                                Published
                            </span>
                        </label>

                        <span
                            className={
                                "project-form__hint"
                            }
                        >
                            Published projects appear
                            on the public portfolio.
                        </span>
                    </div>
                </div>
            </section>

            <section
                className={
                    "project-form__section"
                }
            >
                <header
                    className={
                        "project-form__section-header"
                    }
                >
                    <h3>
                        Project Content
                    </h3>

                    <p>
                        Add the project summary,
                        detailed description, and
                        technology stack.
                    </p>
                </header>

                <div
                    className={
                        "project-form__grid"
                    }
                >
                    <div
                        className={
                            "project-form__field "
                            + "project-form__field--full"
                        }
                    >
                        <div
                            className={
                                "project-form__label-row"
                            }
                        >
                            <label
                                htmlFor={
                                    "project-summary"
                                }
                            >
                                Summary

                                <span
                                    className={
                                        "project-form__required"
                                    }
                                    aria-hidden="true"
                                >
                                    *
                                </span>
                            </label>

                            <CharacterCounter
                                currentLength={
                                    formData.summary.length
                                }
                                maximumLength={
                                    SUMMARY_MAX_LENGTH
                                }
                            />
                        </div>

                        <textarea
                            id="project-summary"
                            name="summary"
                            rows={3}
                            maxLength={
                                SUMMARY_MAX_LENGTH
                            }
                            value={
                                formData.summary
                            }
                            onChange={
                                handleChange
                            }
                            onBlur={
                                handleBlur
                            }
                            disabled={busy}
                            placeholder={
                                "A concise overview of "
                                + "the project."
                            }
                            aria-invalid={
                                Boolean(
                                    summaryError
                                )
                            }
                            aria-describedby={
                                summaryError
                                    ? "project-summary-error"
                                    : undefined
                            }
                        />

                        <FieldError
                            id={
                                "project-summary-error"
                            }
                            message={
                                summaryError
                            }
                        />
                    </div>

                    <div
                        className={
                            "project-form__field "
                            + "project-form__field--full"
                        }
                    >
                        <div
                            className={
                                "project-form__label-row"
                            }
                        >
                            <label
                                htmlFor={
                                    "project-description"
                                }
                            >
                                Description

                                <span
                                    className={
                                        "project-form__required"
                                    }
                                    aria-hidden="true"
                                >
                                    *
                                </span>
                            </label>

                            <CharacterCounter
                                currentLength={
                                    formData
                                        .description
                                        .length
                                }
                                maximumLength={
                                    DESCRIPTION_MAX_LENGTH
                                }
                            />
                        </div>

                        <textarea
                            id={
                                "project-description"
                            }
                            name="description"
                            rows={9}
                            maxLength={
                                DESCRIPTION_MAX_LENGTH
                            }
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            onBlur={
                                handleBlur
                            }
                            disabled={busy}
                            placeholder={
                                "Describe the project, "
                                + "its purpose, features, "
                                + "and technical decisions."
                            }
                            aria-invalid={
                                Boolean(
                                    descriptionError
                                )
                            }
                            aria-describedby={
                                descriptionError
                                    ? "project-description-error"
                                    : undefined
                            }
                        />

                        <FieldError
                            id={
                                "project-description-error"
                            }
                            message={
                                descriptionError
                            }
                        />
                    </div>

                    <div
                        className={
                            "project-form__field "
                            + "project-form__field--full"
                        }
                    >
                        <div
                            className={
                                "project-form__label-row"
                            }
                        >
                            <label
                                htmlFor={
                                    "project-tech-stack"
                                }
                            >
                                Tech Stack
                            </label>

                            <CharacterCounter
                                currentLength={
                                    formData
                                        .techStack
                                        .length
                                }
                                maximumLength={
                                    TECH_STACK_MAX_LENGTH
                                }
                            />
                        </div>

                        <textarea
                            id={
                                "project-tech-stack"
                            }
                            name="techStack"
                            rows={3}
                            maxLength={
                                TECH_STACK_MAX_LENGTH
                            }
                            value={
                                formData.techStack
                            }
                            onChange={
                                handleChange
                            }
                            onBlur={
                                handleBlur
                            }
                            disabled={busy}
                            placeholder={
                                "Java, Spring Boot, "
                                + "React, MySQL"
                            }
                            aria-invalid={
                                Boolean(
                                    techStackError
                                )
                            }
                            aria-describedby={
                                techStackError
                                    ? "project-tech-stack-error"
                                    : "project-tech-stack-hint"
                            }
                        />

                        {
                            techStackError
                                ? (
                                    <FieldError
                                        id={
                                            "project-tech-stack-error"
                                        }
                                        message={
                                            techStackError
                                        }
                                    />
                                )
                                : (
                                    <span
                                        id={
                                            "project-tech-stack-hint"
                                        }
                                        className={
                                            "project-form__hint"
                                        }
                                    >
                                        Separate technologies
                                        with commas.
                                    </span>
                                )
                        }
                    </div>
                </div>
            </section>

            <section
                className={
                    "project-form__section"
                }
            >
                <header
                    className={
                        "project-form__section-header"
                    }
                >
                    <h3>
                        Project Image
                    </h3>

                    <p>
                        Upload an optional JPEG, PNG,
                        or WEBP image up to 5 MB.
                    </p>
                </header>

                <div
                    className={
                        "project-form__image-layout"
                    }
                >
                    <div
                        className={
                            "project-form__image-preview"
                        }
                    >
                        {
                            imagePreviewUrl
                            && !imagePreviewFailed
                                ? (
                                    <img
                                        src={
                                            imagePreviewUrl
                                        }
                                        alt={
                                            formData.title
                                                ? `${formData.title} preview`
                                                : "Project preview"
                                        }
                                        onError={
                                            () => {
                                                setImagePreviewFailed(
                                                    true
                                                );
                                            }
                                        }
                                    />
                                )
                                : (
                                    <span>
                                        {
                                            imagePreviewFailed
                                                ? "Project image unavailable"
                                                : "No project image selected"
                                        }
                                    </span>
                                )
                        }
                    </div>

                    <div
                        className={
                            "project-form__image-controls"
                        }
                    >
                        <label
                            htmlFor="project-image"
                            className="project-form__file-label"
                        >
                            {
                                selectedImage
                                || formData.imageUrl
                                    ? "Change Image"
                                    : "Select Image"
                            }
                        </label>

                        <input
                            ref={
                                fileInputRef
                            }
                            id="project-image"
                            name="image"
                            type="file"
                            accept={
                                "image/jpeg,"
                                + "image/png,"
                                + "image/webp"
                            }
                            onChange={
                                handleImageChange
                            }
                            disabled={busy}
                            aria-invalid={
                                Boolean(
                                    imageError
                                )
                            }
                            aria-describedby={
                                imageError
                                    ? "project-image-error"
                                    : "project-image-hint"
                            }
                        />

                        {
                            selectedImage && (
                                <div
                                    className="project-form__selected-file"
                                >
                                    <div>
                                        <strong>
                                            {
                                                selectedImage?.name
                                            }
                                        </strong>

                                        <span>
                                            {
                                                (
                                                    selectedImage?.size
                                                    / 1024
                                                ).toFixed(1)
                                            }
                                            KB
                                        </span>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="small"
                                        onClick={
                                            clearSelectedImage
                                        }
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )
                        }

                        {
                            formData.imageUrl
                            && !selectedImage
                            && (
                                <span
                                    className={
                                        "project-form__hint"
                                    }
                                >
                                    The existing image will
                                    be retained unless a new
                                    image is selected.
                                </span>
                            )
                        }

                        {
                            imageError
                                ? (
                                    <FieldError
                                        id={
                                            "project-image-error"
                                        }
                                        message={
                                            imageError
                                        }
                                    />
                                )
                                : (
                                    <span
                                        id={
                                            "project-image-hint"
                                        }
                                        className={
                                            "project-form__hint"
                                        }
                                    >
                                        JPEG, PNG, or WEBP.
                                        Maximum size: 5 MB.
                                    </span>
                                )
                        }
                    </div>
                </div>
            </section>

            <section
                className={
                    "project-form__section"
                }
            >
                <header
                    className={
                        "project-form__section-header"
                    }
                >
                    <h3>
                        Project Links
                    </h3>

                    <p>
                        Add optional repository and
                        live demonstration links.
                    </p>
                </header>

                <div
                    className={
                        "project-form__grid"
                    }
                >
                    <div
                        className={
                            "project-form__field"
                        }
                    >
                        <div
                            className={
                                "project-form__label-row"
                            }
                        >
                            <label
                                htmlFor={
                                    "project-repository-url"
                                }
                            >
                                Repository URL
                            </label>

                            <CharacterCounter
                                currentLength={
                                    formData
                                        .repositoryUrl
                                        .length
                                }
                                maximumLength={
                                    URL_MAX_LENGTH
                                }
                            />
                        </div>

                        <input
                            id={
                                "project-repository-url"
                            }
                            name="repositoryUrl"
                            type="url"
                            maxLength={
                                URL_MAX_LENGTH
                            }
                            value={
                                formData.repositoryUrl
                            }
                            onChange={
                                handleChange
                            }
                            onBlur={
                                handleBlur
                            }
                            disabled={busy}
                            placeholder={
                                "https://github.com/user/project"
                            }
                            aria-invalid={
                                Boolean(
                                    repositoryUrlError
                                )
                            }
                            aria-describedby={
                                repositoryUrlError
                                    ? "project-repository-url-error"
                                    : undefined
                            }
                        />

                        <FieldError
                            id={
                                "project-repository-url-error"
                            }
                            message={
                                repositoryUrlError
                            }
                        />
                    </div>

                    <div
                        className={
                            "project-form__field"
                        }
                    >
                        <div
                            className={
                                "project-form__label-row"
                            }
                        >
                            <label
                                htmlFor={
                                    "project-live-url"
                                }
                            >
                                Live URL
                            </label>

                            <CharacterCounter
                                currentLength={
                                    formData.liveUrl.length
                                }
                                maximumLength={
                                    URL_MAX_LENGTH
                                }
                            />
                        </div>

                        <input
                            id={
                                "project-live-url"
                            }
                            name="liveUrl"
                            type="url"
                            maxLength={
                                URL_MAX_LENGTH
                            }
                            value={
                                formData.liveUrl
                            }
                            onChange={
                                handleChange
                            }
                            onBlur={
                                handleBlur
                            }
                            disabled={busy}
                            placeholder={
                                "https://project.example.com"
                            }
                            aria-invalid={
                                Boolean(
                                    liveUrlError
                                )
                            }
                            aria-describedby={
                                liveUrlError
                                    ? "project-live-url-error"
                                    : undefined
                            }
                        />

                        <FieldError
                            id={
                                "project-live-url-error"
                            }
                            message={
                                liveUrlError
                            }
                        />
                    </div>
                </div>
            </section>

            {
                submitError && (
                    <div
                        className={
                            "admin-alert "
                            + "admin-alert--error "
                            + "project-form__error"
                        }
                        role="alert"
                    >
                        {submitError}
                    </div>
                )
            }

            <div
                className={
                    "project-form__actions"
                }
            >
                <Button
                    type="button"
                    variant="secondary"
                    onClick={
                        onCancel
                    }
                    disabled={busy}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    loading={busy}
                    loadingLabel={
                        uploading
                            ? "Uploading image..."
                            : "Saving project..."
                    }
                >
                    {
                        isEditing
                            ? "Update Project"
                            : "Create Project"
                    }
                </Button>
            </div>
        </form>
    );
}