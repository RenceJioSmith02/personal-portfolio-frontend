import Button
    from "../Button/Button";

import Modal
    from "../Modal/Modal";

import "./ConfirmDialog.css";

export default function ConfirmDialog({
    open,
    title = "Confirm action",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    busy = false,
    variant = "danger",
    onConfirm,
    onCancel,
}) {

    const footer = (
        <>
            <Button
                variant="secondary"
                onClick={onCancel}
                disabled={busy}
            >
                {cancelLabel}
            </Button>

            <Button
                variant={variant}
                onClick={onConfirm}
                loading={busy}
                loadingLabel={
                    "Please wait..."
                }
            >
                {confirmLabel}
            </Button>
        </>
    );

    return (
        <Modal
            open={open}
            title={title}
            onClose={onCancel}
            busy={busy}
            size="small"
            closeOnBackdrop
            footer={footer}
        >
            <div
                className={
                    "ui-confirm-dialog"
                }
            >
                <div
                    className={
                        "ui-confirm-dialog__icon"
                    }
                    aria-hidden="true"
                >
                    !
                </div>

                <p>
                    {message}
                </p>
            </div>
        </Modal>
    );
}