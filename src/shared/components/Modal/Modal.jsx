import {
    useEffect,
    useId,
} from "react";

import {
    createPortal,
} from "react-dom";

import "./Modal.css";

export default function Modal({
    open,
    title,
    children,
    footer,
    onClose,
    busy = false,
    size = "medium",
    closeOnBackdrop = true,
}) {

    const titleId =
        useId();

    useEffect(() => {

        if (!open) {
            return undefined;
        }

        function handleKeyDown(event) {

            if (
                event.key === "Escape"
                && !busy
            ) {
                onClose();
            }
        }

        document.body.classList.add(
            "admin-modal-open"
        );

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            document.body.classList.remove(
                "admin-modal-open"
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, [
        open,
        busy,
        onClose,
    ]);

    if (!open) {
        return null;
    }

    function handleBackdropMouseDown(
        event
    ) {

        if (
            closeOnBackdrop
            && !busy
            && event.target === event.currentTarget
        ) {
            onClose();
        }
    }

    return createPortal(
        <div
            className={
                "ui-modal-backdrop"
            }
            role="presentation"
            onMouseDown={
                handleBackdropMouseDown
            }
        >
            <section
                className={
                    `ui-modal ui-modal--${size}`
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                    titleId
                }
            >
                <header
                    className={
                        "ui-modal__header"
                    }
                >
                    <h2
                        id={titleId}
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        className={
                            "ui-modal__close"
                        }
                        aria-label={
                            "Close dialog"
                        }
                        onClick={onClose}
                        disabled={busy}
                    >
                        ×
                    </button>
                </header>

                <div
                    className={
                        "ui-modal__body"
                    }
                >
                    {children}
                </div>

                {
                    footer && (
                        <footer
                            className={
                                "ui-modal__footer"
                            }
                        >
                            {footer}
                        </footer>
                    )
                }
            </section>
        </div>,
        document.body
    );
}