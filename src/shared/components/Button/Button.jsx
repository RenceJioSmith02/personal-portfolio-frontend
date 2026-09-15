import "./Button.css";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "medium",
    loading = false,
    disabled = false,
    fullWidth = false,
    loadingLabel = "Please wait...",
    className = "",
    ...buttonProps
}) {

    const classNames = [
        "ui-button",
        `ui-button--${variant}`,
        `ui-button--${size}`,
        fullWidth
            ? "ui-button--full-width"
            : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            {...buttonProps}
            type={type}
            className={classNames}
            disabled={
                disabled || loading
            }
            aria-busy={loading}
        >
            {
                loading && (
                    <span
                        className={
                            "ui-button__spinner"
                        }
                        aria-hidden="true"
                    />
                )
            }

            <span>
                {
                    loading
                        ? loadingLabel
                        : children
                }
            </span>
        </button>
    );
}