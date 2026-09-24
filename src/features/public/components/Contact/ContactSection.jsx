import {
    Mail,
    MapPin,
    Send,
} from "lucide-react";

import {
    useState,
} from "react";

import "./contact.css";

const INITIAL_FORM = {
    name: "",
    email: "",
    message: "",
};

const WEB3FORMS_ENDPOINT =
    "https://api.web3forms.com/submit";

export default function ContactSection() {

    const [
        formData,
        setFormData,
    ] = useState(
        INITIAL_FORM
    );

    const [
        errors,
        setErrors,
    ] = useState({});

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        submitError,
        setSubmitError,
    ] = useState("");

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    function validateForm() {

        const validationErrors =
            {};

        if (
            !formData.name.trim()
        ) {
            validationErrors.name =
                "Name is required.";
        }

        if (
            !formData.email.trim()
        ) {
            validationErrors.email =
                "Email is required.";
        } else if (
            !/^\S+@\S+\.\S+$/.test(
                formData.email
            )
        ) {
            validationErrors.email =
                "Enter a valid email.";
        }

        if (
            !formData.message.trim()
        ) {
            validationErrors.message =
                "Message is required.";
        } else if (
            formData.message
                .trim()
                .length < 10
        ) {
            validationErrors.message =
                "Use at least 10 characters.";
        }

        setErrors(
            validationErrors
        );

        return (
            Object.keys(
                validationErrors
            ).length === 0
        );
    }

    function handleChange(
        event
    ) {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            previous => ({
                ...previous,
                [name]: value,
            })
        );

        setErrors(
            previous => ({
                ...previous,
                [name]: "",
            })
        );

        setSuccessMessage(
            ""
        );

        setSubmitError(
            ""
        );
    }

    async function handleSubmit(
        event
    ) {

        event.preventDefault();

        setSuccessMessage(
            ""
        );

        setSubmitError(
            ""
        );

        const isValid =
            validateForm();

        if (
            !isValid
            || submitting
        ) {
            return;
        }

        try {

            setSubmitting(
                true
            );

            const response =
                await fetch(
                    WEB3FORMS_ENDPOINT,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                access_key:
                                    import.meta
                                        .env
                                        .VITE_WEB3FORMS_ACCESS_KEY,

                                name:
                                    formData
                                        .name
                                        .trim(),

                                email:
                                    formData
                                        .email
                                        .trim(),

                                message:
                                    formData
                                        .message
                                        .trim(),

                                subject:
                                    "New Portfolio Contact Message",
                            }),
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok
                || !result.success
            ) {

                throw new Error(
                    result.message
                    || "Unable to send message."
                );
            }

            setSuccessMessage(
                "Message sent successfully. Thank you for reaching out!"
            );

            setFormData(
                INITIAL_FORM
            );

            setErrors({});

        } catch (exception) {

            setSubmitError(
                exception.message
                || "Unable to send your message. Please try again."
            );

        } finally {

            setSubmitting(
                false
            );
        }
    }

    return (
        <section
            id="contact"
            className="
                section
                section--alt
            "
        >
            <div
                className="
                    container
                    contact
                "
            >
                <div
                    className="
                        contact__copy
                        reveal
                    "
                >
                    <span
                        className="
                            eyebrow
                        "
                    >
                        Contact
                    </span>

                    <h2>
                        Let’s build
                        something useful.
                    </h2>

                    <p>
                        Have a role,
                        project, or
                        collaboration in
                        mind? Send a
                        message.
                    </p>

                    <div
                        className="
                            contact__detail
                        "
                    >
                        <Mail
                            className="
                                icon
                            "
                        />

                        <span>
                            <small>
                                Email
                            </small>

                            <b>
                                <a href="mailto:rence.jio.smith@gmail.com">rence.jio.smith@gmail.com</a>
                            </b>
                        </span>
                    </div>

                    <div
                        className="
                            contact__detail
                        "
                    >
                        <MapPin
                            className="
                                icon
                            "
                        />

                        <span>
                            <small>
                                Location
                            </small>

                            <b>
                                Manila,
                                Philippines
                            </b>
                        </span>
                    </div>
                </div>

                <form
                    className="
                        contact-form
                        card
                        reveal
                    "
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                >
                    <label>
                        Name

                        <input
                            type="text"
                            name="name"
                            autoComplete="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            aria-invalid={
                                Boolean(
                                    errors.name
                                )
                            }
                        />

                        <small>
                            {
                                errors.name
                            }
                        </small>
                    </label>

                    <label>
                        Email

                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            aria-invalid={
                                Boolean(
                                    errors.email
                                )
                            }
                        />

                        <small>
                            {
                                errors.email
                            }
                        </small>
                    </label>

                    <label>
                        Message

                        <textarea
                            rows={5}
                            name="message"
                            value={
                                formData.message
                            }
                            onChange={
                                handleChange
                            }
                            aria-invalid={
                                Boolean(
                                    errors.message
                                )
                            }
                        />

                        <small>
                            {
                                errors.message
                            }
                        </small>
                    </label>

                    <button
                        type="submit"
                        className="
                            btn
                            btn--primary
                            magnetic
                        "
                        disabled={
                            submitting
                        }
                    >
                        {
                            submitting
                                ? "Sending..."
                                : "Send Message"
                        }

                        <Send
                            size={18}
                        />
                    </button>

                    {
                        successMessage && (
                            <p
                                className="
                                    contact-form__success
                                "
                                role="status"
                            >
                                {
                                    successMessage
                                }
                            </p>
                        )
                    }

                    {
                        submitError && (
                            <p
                                className="
                                    contact-form__error
                                "
                                role="alert"
                            >
                                {
                                    submitError
                                }
                            </p>
                        )
                    }
                </form>
            </div>
        </section>
    );
}