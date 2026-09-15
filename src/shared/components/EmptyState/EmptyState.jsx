import Button
    from "../Button/Button";

import "./EmptyState.css";

export default function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    icon,
}) {

    return (
        <section
            className={
                "ui-empty-state"
            }
        >
            {
                icon && (
                    <div
                        className={
                            "ui-empty-state__icon"
                        }
                        aria-hidden="true"
                    >
                        {icon}
                    </div>
                )
            }

            <h2>
                {title}
            </h2>

            {
                description && (
                    <p>
                        {description}
                    </p>
                )
            }

            {
                actionLabel
                && onAction
                && (
                    <Button
                        variant="primary"
                        onClick={onAction}
                    >
                        {actionLabel}
                    </Button>
                )
            }
        </section>
    );
}