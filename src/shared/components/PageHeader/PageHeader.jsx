import Button
    from "../Button/Button";

import "./PageHeader.css";

export default function PageHeader({
    title,
    description,
    actionLabel,
    onAction,
    actionDisabled = false,
    children,
}) {

    return (
        <header
            className={
                "ui-page-header"
            }
        >
            <div
                className={
                    "ui-page-header__content"
                }
            >
                <h1>
                    {title}
                </h1>

                {
                    description && (
                        <p>
                            {description}
                        </p>
                    )
                }
            </div>

            <div
                className={
                    "ui-page-header__actions"
                }
            >
                {children}

                {
                    actionLabel
                    && onAction
                    && (
                        <Button
                            variant="primary"
                            onClick={onAction}
                            disabled={
                                actionDisabled
                            }
                        >
                            {actionLabel}
                        </Button>
                    )
                }
            </div>
        </header>
    );
}